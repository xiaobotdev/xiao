const { Command } = require('discord.js-commando');
const { list } = require('../../structures/Util');
const path = require('path');
const sounds = ['airhorn', 'cat', 'dun-dun-dun', 'laugh track', 'pikachu', 'space'];

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
				duration: 15
			},
			clientPermissions: ['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'],
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
		if (!channel) return msg.say('Please enter a voice channel first.');
		if (!channel.permissionsFor(this.client.user).has(['CONNECT', 'SPEAK'])) {
			return msg.say('Missing the "Connect" or "Speak" permission for the voice channel.');
		}
		if (!channel.joinable) return msg.say('Your voice channel is not joinable.');
		if (this.client.voiceConnections.has(channel.guild.id)) return msg.say('I am already playing a sound.');
		try {
			const connection = await channel.join();
			const dispatcher = connection.playFile(path.join(__dirname, '..', '..', 'assets', 'sounds', `${sound}.mp3`));
			dispatcher.once('end', async () => {
				channel.leave();
				await msg.react('✅');
			});
			dispatcher.once('error', async () => {
				channel.leave();
				await msg.react('⚠');
			});
			return null;
		} catch (err) {
			channel.leave();
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
