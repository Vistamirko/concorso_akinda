const axios = require('axios');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: __dirname + '/.env' });

// Configuration
const s3Client = new S3Client({ region: process.env.AWS_REGION });
const BUCKET = process.env.AWS_S3_BUCKET;
const SOURCE_URL = process.env.EUROBET_SOURCE_URL;
const S3_KEY = process.env.EUROBET_S3_KEY;

async function mirrorEurobetData() {
    console.log(`[${new Date().toISOString()}] Starting EUROBET mirroring...`);

    try {
        // 1. Fetch data from external source
        console.log(`Fetching data from external source...`);
        const response = await axios.get(SOURCE_URL);
        const newData = response.data;

        // 2. Integrity Check
        if (!Array.isArray(newData)) {
            throw new Error('Data format invalid: Expected an array of posts.');
        }

        console.log(`Received ${newData.length} entries.`);
        
        // Basic validation of the first entry as a sample
        if (newData.length > 0) {
            const sample = newData[0];
            const requiredFields = ['url', 'username', 'timestamp'];
            const missingFields = requiredFields.filter(field => !sample.hasOwnProperty(field));
            if (missingFields.length > 0) {
                console.warn(`Warning: Missing fields in data: ${missingFields.join(', ')}`);
            }
        }

        // 3. Mirroring (Upload to S3 Milan)
        // Note: For "append" logic, we usually read the existing file first, 
        // but if the source is already cumulative, we can just overwrite.
        // Given Task B says "Aggiorni (append)", we'll implement a merge logic.
        
        let finalData = newData;
        try {
            const existingFile = await s3Client.send(new GetObjectCommand({
                Bucket: BUCKET,
                Key: S3_KEY
            }));
            const existingContent = await existingFile.Body.transformToString();
            const existingData = JSON.parse(existingContent);
            
            // Merge logic (avoid duplicates based on URL)
            const existingUrls = new Set(existingData.map(item => item.url));
            const uniqueNewData = newData.filter(item => !existingUrls.has(item.url));
            
            finalData = [...existingData, ...uniqueNewData];
            console.log(`Merged ${uniqueNewData.length} new unique entries. Total: ${finalData.length}`);
        } catch (s3Error) {
            if (s3Error.name === 'NoSuchKey') {
                console.log('No existing file found on S3. Creating new one.');
            } else {
                throw s3Error;
            }
        }

        // 4. Upload to S3
        await s3Client.send(new PutObjectCommand({
            Bucket: BUCKET,
            Key: S3_KEY,
            Body: JSON.stringify(finalData, null, 2),
            ContentType: 'application/json'
        }));

        console.log(`Successfully mirrored data to S3: ${S3_KEY}`);
        
        // 5. Generate Log
        const logEntry = `[${new Date().toISOString()}] SUCCESS: Mirrored ${finalData.length} entries.\n`;
        // In a real server, we might append to a local file or CloudWatch.
        console.log(logEntry);

    } catch (error) {
        console.error(`[${new Date().toISOString()}] ERROR in mirroring: ${error.message}`);
        // Log failure
    }
}

mirrorEurobetData();
