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
					name: 'KINMOZA!',
					url: 'http://www.kinmosa.com/',
					reason: 'Ayaya Sound'
				},
				{
					name: 'Robret Henc',
					url: 'https://www.youtube.com/channel/UCYz0kLfJbdNHU9baJy6u68A',
					reason: 'Subaru Ringtone Sound',
					reasonURL: 'https://www.youtube.com/watch?v=PEyKDgOTQi8'
				},
				{
					name: 'Myinstants',
					url: 'https://www.myinstants.com/index/us/',
					reason: 'Various Meme Sounds',
					reasonURL: 'https://www.myinstants.com/search/?name=meme'
				}
			],
			args: [
				{
					key: 'sound',
					prompt: `What sound do you want to play? Either ${list(sounds, 'or')}.`,
					type: 'string',
					validate: sound => {
						const choice = sound.toLowerCase().replace(/ /g, '-');
						if (sounds.includes(choice)) return true;
						return `You provided an invalid sound. Please choose either ${list(sounds, 'or')}.`;
					},
					parse: sound => `${sound.toLowerCase().replace(/ /g, '-')}.mp3`
				}
			]
		});
	}

	async run(msg, { sound }) {
		const inGuild = msg.guild ? undefined : null;
		const connection = this.client.voice.connections.get(msg.guild.id);
		if (!connection) {
			const usage = this.client.registry.commands.get('join').usage();
			return msg.reply(`I am not in a voice channel. Use ${usage} to fix that!`);
		}
		connection.play(path.join(__dirname, '..', '..', 'assets', 'sounds', 'soundboard', sound));
		if (msg.channel.permissionsFor(this.client.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'])) {
			await msg.react('🔉');
		}
		return null;
	}
};
