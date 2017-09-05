const Command = require('../../structures/Command');
const { list } = require('../../structures/Util');
const path = require('path');
const sounds = ['airhorn', 'cat', 'dun-dun-dun', 'pikachu', 'space'];

module.exports = class SoundboardCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'soundboard',
			aliases: ['sound'],
			group: 'random',
			memberName: 'soundboard',
			description: 'Plays a sound in your voice channel.',
			details: `**Sounds:** ${sounds.join(', ')}`,
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 30
			},
			clientPermissions: ['ADD_REACTIONS'],
			args: [
				{
					key: 'sound',
					prompt: `What sound would you like to play? Either ${list(sounds, 'or')}.`,
					type: 'string',
					default: '',
					validate: sound => {
						if (sounds.includes(sound.toLowerCase())) return true;
						return `Invalid sound, please enter either ${list(sounds, 'or')}.`;
					},
					parse: sound => sound.toLowerCase()
				}
			]
		});
	}

	async run(msg, args) {
		const sound = args.sound || sounds[Math.floor(Math.random() * sounds.length)];
		const channel = msg.member.voiceChannel;
		if (!channel) return msg.say('Please enter a voice channel first.');
		if (!channel.permissionsFor(this.client.user).has(['CONNECT', 'SPEAK'])) {
			return msg.say('Missing the "Connect" or "Speak" permission for the voice channel.');
		}
		if (!channel.joinable) return msg.say('Your Voice Channel is not joinable.');
		if (this.client.voiceConnections.has(channel.guild.id)) return msg.say('I am already playing a sound.');
		const connection = await channel.join();
		await msg.react('🔊');
		const dispatcher = connection.playFile(path.join(__dirname, '..', '..', 'assets', 'sounds', `${sound}.mp3`));
		dispatcher.once('end', () => {
			channel.leave();
			msg.react('✅');
		});
		dispatcher.once('error', () => {
			channel.leave();
			msg.react('⚠');
		});
		return null;
	}
};
