const Command = require('../../framework/Command');

module.exports = class PauseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pause',
			aliases: ['pause-voice-channel', 'pause-vc', 'pause-voice', 'pause-music', 'pause-playing'],
			group: 'util-voice',
			memberName: 'pause',
			description: 'Pauses the current audio playing.',
			guildOnly: true,
			guarded: true
		});
	}

	run(msg) {
		const connection = this.client.dispatchers.get(msg.guild.id);
		if (!connection) return msg.reply('I am not in a voice channel.');
		if (connection.canPlay) {
			return msg.reply('I am not currently playing audio in this server.');
		}
		if (!connection.channel.permissionsFor(msg.author).has('MOVE_MEMBERS')) {
			return msg.reply(`You need the "MOVE_MEMBERS" permission to use the \`${this.name}\` command.`);
		}
		connection.pause();
		return msg.reply('Paused playing.');
	}
};
