const { ShardingManager } = require('discord.js');
const { TOKEN } = process.env;
const Manager = new ShardingManager('./XiaoBot.js', { token: TOKEN });
Manager.spawn(2);
