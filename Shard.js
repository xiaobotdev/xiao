const { ShardingManager } = require('discord.js');
const path = require('path');
const { token } = require('./config');
const manager = new ShardingManager(path.join(__dirname, 'XiaoBot.js'), { token });
manager.spawn(null, 1000);
