#!/bin/bash

# AWS Milano Social Contest Storage Setup script
# This script configures an S3 bucket in the Milan region (eu-south-1)
# with a CORS policy and a folder structure for social contest data.

# Configuration - EDIT THESE VALUES
BUCKET_NAME="penny-eurobet-storage-milan" # Stable bucket name
REGION="eu-south-1"
VERCEL_DOMAIN="https://concorsi-penny-social.it" # Domain from package.json

echo "Setting up AWS Milano Social Contest Storage..."

# 1. Create S3 Bucket in Milan Region (if it doesn't exist)
echo "--- 1. Checking S3 bucket: $BUCKET_NAME ---"
if aws s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
    echo "Bucket $BUCKET_NAME already exists. Skipping creation."
else
    echo "Creating S3 bucket: $BUCKET_NAME in $REGION..."
    aws s3api create-bucket \
        --bucket $BUCKET_NAME \
        --region $REGION \
        --create-bucket-configuration LocationConstraint=$REGION
fi

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
        "https://concorso-akinda.vercel.app",
        "https://concorso-akinda-milano.vercel.app",
        "http://localhost:3000"
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
echo "--- 3. Ensuring folder structure: /eurobet/ and /penny/ ---"
# Note: put-object just ensures the prefix exists by creating an empty object ending in /
aws s3api put-object --bucket $BUCKET_NAME --key eurobet/ > /dev/null
aws s3api put-object --bucket $BUCKET_NAME --key penny/ > /dev/null
aws s3api put-object --bucket $BUCKET_NAME --key data/ > /dev/null

# 4. Disable Public Access Block (to allow the public read-only policy)
# Since 2023, S3 blocks public access by default. We must disable it to allow public-read policies.
echo "--- 4. Disabling S3 Block Public Access for $BUCKET_NAME ---"
aws s3api put-public-access-block \
    --bucket $BUCKET_NAME \
    --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

echo "--- 5. Setting Bucket Policy for public read-only (obfuscation) ---"
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
