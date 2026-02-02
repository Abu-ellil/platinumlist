const { Client } = require('ssh2');

const config = {
    host: '76.13.5.110',
    port: 22,
    username: 'root',
    password: 'Mahmoud@2255',
};

const REPO_URL = 'https://github.com/Abu-ellil/platinumlist.git';
const APP_DIR = '/var/www/platinumlist';

async function deploy() {
    console.log('🚀 Starting deployment from GitHub...');

    const conn = new Client();
    conn.on('ready', () => {
        console.log('✅ SSH Connected');

        const commands = [
            // 1. Ensure git is installed
            'apt-get update && apt-get install -y git',
            
            // 2. Setup directory and clone/pull
            `mkdir -p ${APP_DIR}`,
            `if [ ! -d "${APP_DIR}/.git" ]; then git clone ${REPO_URL} ${APP_DIR}; else cd ${APP_DIR} && git fetch --all && git reset --hard origin/main; fi`,
            
            // 3. Navigate to app directory
            `cd ${APP_DIR}`,

            // 4. Install Node.js 20 if missing
            'export DEBIAN_FRONTEND=noninteractive',
            'if ! command -v node &> /dev/null; then curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs; fi',
            
            // 5. Install Puppeteer/Chrome dependencies
            'apt-get install -y ca-certificates fonts-liberation libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1-0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils',
            
            // 6. Install PM2 globally
            'if ! command -v pm2 &> /dev/null; then npm install -g pm2; fi',
            'PM2_BIN=$(which pm2 || echo "/usr/local/bin/pm2")',

            // 7. Install dependencies and build
            'npm install',
            'npm run build',

            // 8. Start/Restart with PM2
            `$PM2_BIN reload ecosystem.config.js || $PM2_BIN start ecosystem.config.js`,
            `$PM2_BIN save`
        ].join(' && ');

        console.log('⏳ Executing remote commands (this may take a few minutes)...');
        
        conn.exec(commands, (err, stream) => {
            if (err) throw err;
            stream.on('close', (code, signal) => {
                console.log(`\n✅ Deployment finished with code ${code}`);
                conn.end();
                if (code === 0) {
                    console.log('🚀 APP IS LIVE AND UPDATED FROM GITHUB!');
                } else {
                    console.error('❌ Deployment failed. Check the logs above.');
                }
            }).on('data', (data) => {
                process.stdout.write(data);
            }).stderr.on('data', (data) => {
                process.stderr.write(data);
            });
        });
    }).connect(config);
}

deploy().catch(console.error);
