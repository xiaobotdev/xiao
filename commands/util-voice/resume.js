const Command = require('../../framework/Command');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = class ResumeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'resume',
			aliases: ['resume-voice-channel', 'resume-vc', 'resume-voice', 'resume-music', 'resume-playing'],
			group: 'util-voice',
			memberName: 'resume',
			description: 'Resume the current audio playing.',
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
		this.client.dispatchers.get(msg.guild.id).unpause();
		return msg.reply('Resumed playing.');
	}
};
