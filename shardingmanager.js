const { ShardingManager } = require('discord.js');
const Manager = new ShardingManager('./index.js');
Manager.spawn(1);

process.on('unhandledRejection', console.error);
