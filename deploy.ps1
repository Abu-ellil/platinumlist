# Configuration
$SERVER = "root@76.13.5.110"
$APP_DIR = "/var/www/platinumlist"

Write-Host "🚀 Starting deployment to $SERVER..." -ForegroundColor Cyan

# 1. Build locally
Write-Host "📦 Building the application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Deployment aborted." -ForegroundColor Red
    exit
}

# 2. Create a deployment package
Write-Host "📦 Creating deployment package..." -ForegroundColor Yellow
$TAR_FILES = ".next", "public", "package.json", "package-lock.json", "ecosystem.config.js", ".env.local"
if (Test-Path "data") {
    $TAR_FILES += "data"
}

# Use tar (available in modern Windows)
tar -czf deploy.tar.gz $TAR_FILES

# 3. Transfer to server
Write-Host "🚚 Transferring files to server..." -ForegroundColor Yellow
ssh $SERVER "mkdir -p $APP_DIR"
scp deploy.tar.gz "$SERVER`:$APP_DIR"

# 4. Extract and Install on server
Write-Host "🔧 Extracting and installing dependencies on server..." -ForegroundColor Yellow
ssh $SERVER "cd $APP_DIR && tar -xzf deploy.tar.gz && npm install --production && pm2 reload ecosystem.config.js || pm2 start ecosystem.config.js"

# 5. Cleanup
Write-Host "🧹 Cleaning up local files..." -ForegroundColor Yellow
Remove-Item deploy.tar.gz

Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
