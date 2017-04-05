const Discord = require('discord.js');
const Manager = new Discord.ShardingManager('./index.js', {
    token: process.env.TOKEN
});
Manager.spawn();

process.on('unhandledRejection', console.error);
