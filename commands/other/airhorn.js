const Command = require('../../structures/Command');
const path = require('path');
const sounds = require('../../assets/json/airhorn');

module.exports = class AirhornCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'airhorn',
			group: 'other',
			memberName: 'airhorn',
			description: 'Plays an airhorn sound in a voice channel.',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 10
			},
			credit: [
				{
					name: 'Discord',
					url: 'https://discord.com/',
					reason: 'Airhorn Sounds',
					reasonURL: 'https://github.com/discord/airhornbot/tree/master/audio'
				}
			]
		});
	}

	async run(msg) {
		const voiceChannel = msg.member.voice.channel;
		if (!voiceChannel) return msg.say('Please enter a voice channel first.');
		if (!voiceChannel.permissionsFor(this.client.user).has(['CONNECT', 'SPEAK'])) {
			return msg.say('Missing the "Connect" or "Speak" permission for the voice channel.');
		}
		if (!voiceChannel.joinable) return msg.say('Your voice channel is not joinable.');
		if (this.client.voice.connections.has(voiceChannel.guild.id)) return msg.say('I am already playing a sound.');
		try {
			const connection = await voiceChannel.join();
			const airhorn = sounds[Math.floor(Math.random() * sounds.length)];
			const dispatcher = connection.play(path.join(__dirname, '..', '..', 'assets', 'sounds', 'airhorn', airhorn));
			await msg.react('🔉');
			dispatcher.once('finish', () => voiceChannel.leave());
			dispatcher.once('error', () => voiceChannel.leave());
			return null;
		} catch (err) {
			voiceChannel.leave();
			throw err;
		}
	}
};
