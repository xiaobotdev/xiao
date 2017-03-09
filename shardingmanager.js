const Discord = require('discord.js');
const Manager = new Discord.ShardingManager('./index.js');
Manager.spawn(2);