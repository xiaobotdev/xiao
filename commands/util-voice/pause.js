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
		const connection = this.client.voice.connections.get(msg.guild.id);
		if (!connection) return msg.reply('I am not in a voice channel.');
		if (!msg.channel.permissionsFor(msg.author).has('MOVE_MEMBERS') && connection.channel.members.size > 2) {
			return msg.reply('You need the "Move members" permission to stop playing audio.');
		}
		if (!this.client.dispatchers.has(msg.guild.id)) {
			return msg.reply(`I am not currently playing audio in this server.`);
		}
		this.client.dispatchers.get(msg.guild.id).pause();
		return msg.reply('Paused playing.');
	}
};
