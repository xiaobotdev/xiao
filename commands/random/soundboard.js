const Command = require('../../structures/Command');
const sounds = require('../../assets/json/soundboard');
const path = require('path');

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
					prompt: 'What sound would you like to play?',
					type: 'string',
					validate: sound => {
						if (sounds.includes(sound.toLowerCase())) return true;
						return 'Invalid Sound. Use `help soundboard` for a list of sounds.';
					},
					parse: sound => sound.toLowerCase()
				}
			]
		});
	}

	async run(msg, args) {
		const { sound } = args;
		const channel = msg.member.voiceChannel;
		if (!channel) return msg.say('Please enter a Voice Channel first.');
		if (!channel.permissionsFor(this.client.user).has(['CONNECT', 'SPEAK'])) {
			return msg.say('Missing the `Connect` or `Speak` Permission for the Voice Channel.');
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
