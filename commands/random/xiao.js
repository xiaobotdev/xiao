const { Command } = require('discord.js-commando');
const xiaos = require('../../assets/json/xiao');

module.exports = class XiaoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'xiao',
			aliases: ['xiao-pai', 'iao'],
			group: 'random',
			memberName: 'xiao',
			description: 'Responds with a random image of Xiao Pai.',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	run(msg) {
		return msg.say({ files: [xiaos[Math.floor(Math.random() * xiaos.length)]] });
	}
};
