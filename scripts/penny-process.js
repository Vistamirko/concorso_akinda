const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: __dirname + '/.env' });

// Configuration
const s3Client = new S3Client({ region: process.env.AWS_REGION });
const BUCKET = process.env.AWS_S3_BUCKET;
const PENNY_UPLOADS_PREFIX = 'penny/uploads/';
const PENNY_OFFICIAL_KEY = 'penny/data.json';

async function processPennyData() {
    console.log(`[${new Date().toISOString()}] Starting PENNY data processing...`);

    try {
        // 1. List objects in uploads folder
        const listResponse = await s3Client.send(new ListObjectsV2Command({
            Bucket: BUCKET,
            Prefix: PENNY_UPLOADS_PREFIX
        }));

        const rawFiles = listResponse.Contents ? listResponse.Contents.filter(c => c.Key !== PENNY_UPLOADS_PREFIX) : [];
        if (rawFiles.length === 0) {
            console.log('No new files in penny/uploads/');
            return;
        }

        console.log(`Found ${rawFiles.length} new files to process.`);

        // 2. Load existing official data
        let officialData = [];
        try {
            const existingFile = await s3Client.send(new GetObjectCommand({
                Bucket: BUCKET,
                Key: PENNY_OFFICIAL_KEY
            }));
            const content = await existingFile.Body.transformToString();
            officialData = JSON.parse(content);
        } catch (e) {
            if (e.name !== 'NoSuchKey') throw e;
            console.log('Official data file not found, creating new one.');
        }

        // 3. Process each new file
        for (const file of rawFiles) {
            console.log(`Processing ${file.Key}...`);
            const fileData = await s3Client.send(new GetObjectCommand({
                Bucket: BUCKET,
                Key: file.Key
            }));
            const content = await fileData.Body.transformToString();
            
            let jsonData;
            try {
                // Determine if it's CSV or JSON (simple check)
                if (file.Key.endsWith('.json')) {
                    jsonData = JSON.parse(content);
                } else if (file.Key.endsWith('.csv')) {
                    // Simple CSV to JSON logic (could use a library for production)
                    const lines = content.split('\n');
                    const headers = lines[0].split(',');
                    jsonData = lines.slice(1).filter(l => l.trim()).map(line => {
                        const values = line.split(',');
                        return headers.reduce((obj, header, index) => {
                            obj[header.trim()] = values[index]?.trim();
                            return obj;
                        }, {});
                    });
                } else {
                    console.error(`Unsupported file extension for ${file.Key}`);
                    continue;
                }

                // 4. Validate and Merge
                if (Array.isArray(jsonData)) {
                    // Check for unique identifiers if available
                    officialData = [...officialData, ...jsonData];
                    console.log(`Merged ${jsonData.length} entries from ${file.Key}`);
                } else {
                    console.log(`Skipping ${file.Key}: data is not an array.`);
                }

                // 5. Cleanup: Delete processed file from uploads
                await s3Client.send(new DeleteObjectCommand({
                    Bucket: BUCKET,
                    Key: file.Key
                }));
                console.log(`Deleted ${file.Key} after processing.`);

            } catch (err) {
                console.error(`Error processing ${file.Key}: ${err.message}`);
            }
        }

        // 6. Update Official File
        await s3Client.send(new PutObjectCommand({
            Bucket: BUCKET,
            Key: PENNY_OFFICIAL_KEY,
            Body: JSON.stringify(officialData, null, 2),
            ContentType: 'application/json'
        }));

        console.log(`Successfully updated official PENNY data. Total: ${officialData.length}`);

    } catch (error) {
        console.error(`[${new Date().toISOString()}] ERROR in PENNY processing: ${error.message}`);
    }
}

processPennyData();
