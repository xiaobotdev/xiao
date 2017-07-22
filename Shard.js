const { ShardingManager } = require('discord.js');
const path = require('path');
const { token } = require('./config');
const Manager = new ShardingManager(path.join(__dirname, 'XiaoBot.js'), { token });
Manager.spawn();
