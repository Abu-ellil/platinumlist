module.exports = {
  apps: [
    {
      name: 'platinumlist',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3100
      }
    }
  ]
};
