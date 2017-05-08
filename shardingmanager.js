const { ShardingManager } = require('discord.js');
const { TOKEN } = process.env;
const Manager = new ShardingManager('./index.js', { token: TOKEN });
Manager.spawn();
