const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class DECTalkCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dec-talk',
			aliases: ['moon-base-alpha', 'text-to-speech', 'tts'],
			group: 'voice',
			memberName: 'dec-talk',
			description: 'The world\'s best Text-to-Speech.',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 10
			},
			args: [
				{
					key: 'text',
					prompt: 'What text do you want to say?',
					type: 'string',
					max: 1024
				}
			]
		});
	}

	async run(msg, { text }) {
		const voiceChannel = msg.member.voice.channel;
		if (!voiceChannel) return msg.say('Please enter a voice channel first.');
		if (!voiceChannel.permissionsFor(this.client.user).has(['CONNECT', 'SPEAK'])) {
			return msg.say('Missing the "Connect" or "Speak" permission for the voice channel.');
		}
		if (!voiceChannel.joinable) return msg.say('Your voice channel is not joinable.');
		if (this.client.voiceConnections.has(voiceChannel.guild.id)) return msg.say('I am already playing a sound.');
		try {
			const connection = await voiceChannel.join();
			const { url } = await request
				.get('http://tts.cyzon.us/tts')
				.query({ text });
			const dispatcher = connection.play(url);
			dispatcher.once('finish', () => voiceChannel.leave());
			dispatcher.once('error', () => voiceChannel.leave());
			return null;
		} catch (err) {
			voiceChannel.leave();
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
