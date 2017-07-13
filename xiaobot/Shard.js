const { ShardingManager } = require('discord.js');
const { token } = require('./config');
const Manager = new ShardingManager('./XiaoBot.js', { token });
Manager.spawn();
