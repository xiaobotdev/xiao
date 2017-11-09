const { Command } = require('discord.js-commando');
const { list } = require('../../util/Util');
const path = require('path');
const sounds = require('../../assets/json/soundboard');

module.exports = class SoundboardCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'soundboard',
			aliases: ['sound'],
			group: 'other',
			memberName: 'soundboard',
			description: 'Plays a sound in your voice channel.',
			details: `**Sounds**: ${sounds.join(', ')}`,
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 15
			},
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

	async run(msg, { sound }) {
		if (!sound) sound = sounds[Math.floor(Math.random() * sounds.length)];
		const channel = msg.member.voiceChannel;
		if (!channel) return msg.reply('Please enter a voice channel first.');
		if (!channel.permissionsFor(this.client.user).has(['CONNECT', 'SPEAK'])) {
			return msg.reply('Missing the "Connect" or "Speak" permission for the voice channel.');
		}
		if (!channel.joinable) return msg.reply('Your voice channel is not joinable.');
		if (this.client.voiceConnections.has(channel.guild.id)) return msg.reply('I am already playing a sound.');
		try {
			const connection = await channel.join();
			const dispatcher = connection.playFile(path.join(__dirname, '..', '..', 'assets', 'sounds', `${sound}.mp3`));
			dispatcher.once('end', () => channel.leave());
			dispatcher.once('error', () => channel.leave());
			return null;
		} catch (err) {
			channel.leave();
			throw err;
		}
	}
};
