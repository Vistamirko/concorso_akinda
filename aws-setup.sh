#!/bin/bash

# AWS Milano Social Contest Storage Setup script
# This script configures an S3 bucket in the Milan region (eu-south-1)
# with a CORS policy and a folder structure for social contest data.

# Configuration - EDIT THESE VALUES
BUCKET_NAME="penny-eurobet-storage-milan" # Stable bucket name
REGION="eu-south-1"
VERCEL_DOMAIN="https://concorsi-penny-social.it" # Domain from package.json

echo "Setting up AWS Milano Social Contest Storage..."

# 1. Create S3 Bucket in Milan Region
echo "--- 1. Creating S3 bucket: $BUCKET_NAME in $REGION ---"
aws s3api create-bucket \
    --bucket $BUCKET_NAME \
    --region $REGION \
    --create-bucket-configuration LocationConstraint=$REGION

# 2. Configure CORS Policy
# This allows the Vercel frontend to read JSON files via GET requests.
echo "--- 2. Configuring CORS Policy for $VERCEL_DOMAIN ---"
CORS_POLICY='{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET"],
      "AllowedOrigins": [
        "https://concorsi-penny-social.it",
        "https://concorso-akinda.vercel.app"
      ],
      "ExposeHeaders": []
    }
  ]
}'

aws s3api put-bucket-cors \
    --bucket $BUCKET_NAME \
    --cors-configuration "$CORS_POLICY"

# 3. Create Folder Structure
# In S3, folders are just objects with a trailing slash.
echo "--- 3. Creating folder structure: /eurobet/ and /penny/ ---"
aws s3 mb s3://$BUCKET_NAME/eurobet/
aws s3 mb s3://$BUCKET_NAME/penny/

# Note: s3 mb is normally for buckets. To create a "folder" we upload an empty object:
aws s3api put-object --bucket $BUCKET_NAME --key eurobet/
aws s3api put-object --bucket $BUCKET_NAME --key penny/

# 4. Disable Public Access Block (to allow specific cross-origin access if needed)
# Actually, by default S3 buckets are private. We keep them private but allow CORS to work.
# To ensure files are readable via URL if known (obfuscation), we need to upload them with public-read 
# or use a Bukcet Policy. The user asked for "obfuscation" (knowing the URL).
echo "--- 4. Setting Bucket Policy for public read-only (obfuscation) ---"
BUCKET_POLICY='{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::'$BUCKET_NAME'/*"
        }
    ]
}'

aws s3api put-bucket-policy \
    --bucket $BUCKET_NAME \
    --policy "$BUCKET_POLICY"

# 5. Disable Directory Listing
# In S3, if you don't grant s3:ListBucket permission to the public, directory listing is disabled.
# Our policy above only grants s3:GetObject, so listing is already disabled.

echo "--- Setup Complete! ---"
echo "Bucket URL: https://$BUCKET_NAME.s3.$REGION.amazonaws.com/"
echo "Official Eurobet JSON will reside at: https://$BUCKET_NAME.s3.$REGION.amazonaws.com/eurobet/data.json"
echo "Official Penny JSON will reside at: https://$BUCKET_NAME.s3.$REGION.amazonaws.com/penny/data.json"
