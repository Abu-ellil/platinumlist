#!/bin/bash

# Configuration
SERVER="root@76.13.5.110"
APP_DIR="/var/www/platinumlist"

echo "🚀 Starting deployment to $SERVER..."

# 1. Build locally
echo "📦 Building the application..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed. Deployment aborted."
  exit 1
fi

# 2. Create a deployment package
echo "📦 Creating deployment package..."
# Include data directory if it exists
TAR_FILES=".next public package.json package-lock.json ecosystem.config.js .env.local"
if [ -d "data" ]; then
  TAR_FILES="$TAR_FILES data"
fi
tar -czf deploy.tar.gz $TAR_FILES

# 3. Transfer to server
echo "🚚 Transferring files to server..."
ssh $SERVER "mkdir -p $APP_DIR"
scp deploy.tar.gz $SERVER:$APP_DIR

# 4. Extract and Install on server
echo "🔧 Extracting and installing dependencies on server..."
ssh $SERVER "cd $APP_DIR && tar -xzf deploy.tar.gz && npm install --production && pm2 reload ecosystem.config.js || pm2 start ecosystem.config.js"

# 5. Cleanup
echo "🧹 Cleaning up local files..."
rm deploy.tar.gz

echo "✅ Deployment completed successfully!"
