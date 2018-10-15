const Command = require('../../structures/Command');
const { list } = require('../../util/Util');
const path = require('path');
const sounds = require('../../assets/json/soundboard');

module.exports = class SoundboardCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'soundboard',
			aliases: ['sound', 'foley'],
			group: 'voice',
			memberName: 'soundboard',
			description: 'Plays a sound in your voice channel.',
			details: `**Sounds:** ${Object.keys(sounds).join(', ')}`,
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 10
			},
			userPermissions: ['CONNECT', 'SPEAK'],
			clientPermissions: ['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'],
			args: [
				{
					key: 'sound',
					prompt: `What sound would you like to play? Either ${list(Object.keys(sounds), 'or')}.`,
					type: 'string',
					oneOf: Object.keys(sounds),
					parse: sound => sound.toLowerCase()
				}
			]
		});
	}

	async run(msg, { sound }) {
		const voiceChannel = msg.member.voice.channel;
		if (!voiceChannel) return msg.reply('Please enter a voice channel first.');
		if (!voiceChannel.permissionsFor(this.client.user).has(['CONNECT', 'SPEAK'])) {
			return msg.reply('Missing the "Connect" or "Speak" permission for the voice channel.');
		}
		if (!voiceChannel.joinable) return msg.reply('Your voice channel is not joinable.');
		if (this.client.voiceConnections.has(voiceChannel.guild.id)) return msg.reply('I am already playing a sound.');
		try {
			const connection = await voiceChannel.join();
			const dispatcher = connection.play(path.join(__dirname, '..', '..', 'assets', 'sounds', sounds[sound]));
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
