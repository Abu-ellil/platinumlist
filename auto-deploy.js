const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { execSync } = require('child_process');

const config = {
    host: '76.13.5.110',
    port: 22,
    username: 'root',
    password: 'Mahmoud@2255',
};

const APP_DIR = '/var/www/platinumlist';
const PACKAGE_NAME = 'deploy.tar.gz';

async function deploy() {
    console.log('🚀 Starting automated deployment...');

    // 1. Build locally
    console.log('📦 Building application...');
    try {
        execSync('npm run build', { stdio: 'inherit' });
    } catch (err) {
        console.error('❌ Build failed');
        process.exit(1);
    }

    // 2. Archive files
    console.log('📦 Creating archive...');
    await new Promise((resolve, reject) => {
        const output = fs.createWriteStream(path.join(process.cwd(), PACKAGE_NAME));
        const archive = archiver('tar', { gzip: true });
        output.on('close', resolve);
        archive.on('error', reject);
        archive.pipe(output);

        // Files/folders to include
        archive.directory('.next/', '.next');
        archive.directory('public/', 'public');
        if (fs.existsSync('data')) archive.directory('data/', 'data');
        archive.file('package.json', { name: 'package.json' });
        archive.file('package-lock.json', { name: 'package-lock.json' });
        archive.file('ecosystem.config.js', { name: 'ecosystem.config.js' });
        archive.file('.env.local', { name: '.env.local' });
        archive.finalize();
    });

    const conn = new Client();
    conn.on('ready', () => {
        console.log('✅ SSH Connected');

        // 3. Upload file
        conn.sftp((err, sftp) => {
            if (err) throw err;
            const stats = fs.statSync(path.join(process.cwd(), PACKAGE_NAME));
            const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
            console.log(`🚚 Uploading archive (${sizeInMB} MB)...`);
            
            const readStream = fs.createReadStream(path.join(process.cwd(), PACKAGE_NAME));
            const remotePath = `/root/${PACKAGE_NAME}`;
            const writeStream = sftp.createWriteStream(remotePath);

            writeStream.on('error', (err) => {
                console.error('❌ SFTP Write Error:', err);
                conn.end();
            });

            readStream.on('error', (err) => {
                console.error('❌ Local Read Error:', err);
                conn.end();
            });

            writeStream.on('close', () => {
                console.log('✅ Upload complete');

                // 4. Extract and Setup
                console.log('🔧 Extracting and installing dependencies on server...');
                const commands = [
                    `mkdir -p ${APP_DIR}`,
                    `mv ${remotePath} ${APP_DIR}/${PACKAGE_NAME}`,
                    `cd ${APP_DIR}`,
                    `tar -xzf ${PACKAGE_NAME}`,
                    // Install Node.js if missing
                    'export DEBIAN_FRONTEND=noninteractive',
                    'if ! command -v node &> /dev/null; then curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs; fi',
                    // Install PM2 globally and ensure it's in PATH
                    'if ! command -v pm2 &> /dev/null; then npm install -g pm2; fi',
                    // Use full path for pm2 if still not in command-v
                    'PM2_BIN=$(which pm2 || echo "/usr/local/bin/pm2")',
                    // Install Puppeteer dependencies for Chrome
                    'apt-get update && apt-get install -y ca-certificates fonts-liberation libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils',
                    // Install specific missing library that failed in previous run
                    'apt-get install -y libatk1.0-0',
                    'npm install --production',
                    `$PM2_BIN reload ecosystem.config.js || $PM2_BIN start ecosystem.config.js`,
                    `$PM2_BIN save`
                ].join(' && ');

                conn.exec(commands, (err, stream) => {
                    if (err) throw err;
                    stream.on('close', (code, signal) => {
                        console.log(`✅ Deployment finished with code ${code}`);
                        conn.end();
                        fs.unlinkSync(PACKAGE_NAME);
                        console.log('🚀 APP IS LIVE!');
                    }).on('data', (data) => {
                        process.stdout.write(data);
                    }).stderr.on('data', (data) => {
                        process.stderr.write(data);
                    });
                });
            });

            readStream.pipe(writeStream);
        });
    }).connect(config);
}

deploy().catch(console.error);
