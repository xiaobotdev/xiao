const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');

module.exports = class DECTalkCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dec-talk',
			aliases: ['moon-base-alpha', 'text-to-speech', 'tts'],
			group: 'text-edit',
			memberName: 'dec-talk',
			description: 'The world\'s best Text-to-Speech.',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 15
			},
			args: [
				{
					key: 'text',
					prompt: 'What text do you want to convert to TTS?',
					type: 'string',
					max: 1000
				}
			]
		});
	}

	async run(msg, { text }) {
		const channel = msg.member.voiceChannel;
		if (!channel) return msg.say('Please enter a voice channel first.');
		if (!channel.permissionsFor(this.client.user).has(['CONNECT', 'SPEAK'])) {
			return msg.say('Missing the "Connect" or "Speak" permission for the voice channel.');
		}
		if (!channel.joinable) return msg.say('Your voice channel is not joinable.');
		if (this.client.voiceConnections.has(channel.guild.id)) return msg.say('I am already playing a sound.');
		try {
			const connection = await channel.join();
			const stream = snekfetch
				.get('http://tts.cyzon.us/tts')
				.query({ text });
			const dispatcher = connection.playStream(stream);
			dispatcher.once('end', () => channel.leave());
			dispatcher.once('error', () => channel.leave());
			return null;
		} catch (err) {
			channel.leave();
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
