const { ShardingManager } = require('discord.js');
const path = require('path');
const { TOKEN } = process.env;
const manager = new ShardingManager(path.join(__dirname, 'XiaoBot.js'), { token: TOKEN });
manager.spawn(1000000, 1000);
