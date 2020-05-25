const Command = require('../../structures/Command');
const path = require('path');
const { list } = require('../../util/Util');
const sounds = require('../../assets/json/soundboard');

module.exports = class SoundboardCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'soundboard',
			aliases: ['sound'],
			group: 'voice',
			memberName: 'soundboard',
			description: 'Plays a sound in a voice channel.',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 10
			},
			userPermissions: ['CONNECT', 'SPEAK'],
			credit: [
				{
					name: 'Pokémon',
					url: 'https://www.pokemon.com/us/',
					reason: 'Pikachu Sound'
				},
				{
					name: '07th Expansion',
					url: 'http://07th-expansion.net/',
					reason: 'Nipah Sound'
				},
				{
					name: 'Re:ZERO -Starting Life in Another World-',
					url: 'http://re-zero-anime.jp/',
					reason: 'Subaru Ringtone Sound'
				}
			],
			args: [
				{
					key: 'sound',
					prompt: `What sound do you want to play? Either ${list(sounds, 'or')}.`,
					type: 'string',
					default: () => `${sounds[Math.floor(Math.random() * sounds.length)]}.mp3`,
					oneOf: sounds,
					parse: sound => `${sound.toLowerCase()}.mp3`
				}
			]
		});
	}

	async run(msg, { sound }) {
		const inGuild = msg.guild ? undefined : null;
		const connection = this.client.voice.connections.get(msg.guild.id);
		if (!connection) {
			return msg.reply(`I am not in a voice channel. Use ${msg.anyUsage('join', inGuild, inGuild)} to fix that!`);
		}
		connection.play(path.join(__dirname, '..', '..', 'assets', 'sounds', 'soundboard', sound));
		if (msg.channel.permissionsFor(this.client.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'])) {
			await msg.react('🔉');
		}
		return null;
	}
};
