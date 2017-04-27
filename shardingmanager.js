const { ShardingManager } = require('discord.js');
const Manager = new ShardingManager('./index.js', {
    token: process.env.TOKEN
});
Manager.spawn(1);

process.on('unhandledRejection', console.error);
