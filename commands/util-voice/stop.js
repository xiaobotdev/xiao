const Command = require('../../framework/Command');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = class StopCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'stop',
			aliases: ['stop-voice-channel', 'stop-vc', 'stop-voice', 'stop-music', 'stop-playing'],
			group: 'util-voice',
			memberName: 'stop',
			description: 'Stops the current audio playing.',
			guildOnly: true,
			guarded: true
		});
	}

	run(msg) {
		const connection = getVoiceConnection(msg.guild.id);
		if (!connection) return msg.reply('I am not in a voice channel.');
		if (!this.client.dispatchers.has(msg.guild.id)) {
			return msg.reply(`I am not currently playing audio in this server.`);
		}
		this.client.dispatchers.get(msg.guild.id).stop();
		return msg.reply('Stopped playing.');
	}
};
