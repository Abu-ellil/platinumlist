const { Client } = require('ssh2');

const config = {
    host: '76.13.5.110',
    port: 22,
    username: 'root',
    password: 'Mahmoud@@2222',
};

const APP_DIR = '/var/www/platinumlist';

const conn = new Client();
conn.on('ready', () => {
    console.log('✅ SSH Connected to VPS');
    
    const commands = [
        'export DEBIAN_FRONTEND=noninteractive',
        'apt-get update',
        'apt-get install -y chromium-browser fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libasound2t64 libpango-1.0-0 libcairo2 --no-install-recommends',
        `mkdir -p ${APP_DIR}`,
        `cd ${APP_DIR}`,
        'npm install puppeteer-extra puppeteer-extra-plugin-stealth',
        'export PATH=$PATH:/usr/local/bin:/usr/bin',
        'if ! command -v pm2 &> /dev/null; then npm install -g pm2; fi',
        'PM2_BIN=$(which pm2 || echo "/usr/local/bin/pm2")',
        `$PM2_BIN restart platinumlist || $PM2_BIN start ecosystem.config.js --name platinumlist || echo "Skipping PM2 start as ecosystem.config.js might be missing"`
    ].join(' && ');

    console.log('🔧 Running fix commands on server...');
    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('❌ Execution error:', err);
            conn.end();
            return;
        }
        stream.on('close', (code, signal) => {
            console.log(`✅ Finished with code: ${code}`);
            conn.end();
        }).on('data', (data) => {
            console.log('STDOUT: ' + data);
        }).stderr.on('data', (data) => {
            console.error('STDERR: ' + data);
        });
    });
}).on('error', (err) => {
    console.error('❌ Connection error:', err);
}).connect(config);
