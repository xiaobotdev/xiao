const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const path = require('path');
const { promisifyAll } = require('tsubaki');
const fs = promisifyAll(require('fs'));

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
			clientPermissions: ['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'],
			args: [
				{
					key: 'text',
					prompt: 'What text do you want to convert to TTS?',
					type: 'string',
					validate: text => {
						if (text.length < 1000) return true;
						return 'Invalid text, please keep the text under 1000 characters.';
					}
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
		const file = path.join(__dirname, '..', '..', 'temp', `dec-talk ${channel.guild.id}.mp3`);
		try {
			const connection = await channel.join();
			const { body } = await snekfetch
				.get('http://tts.cyzon.us/tts', { followRedirects: true })
				.query({ text });
			await fs.writeFileAsync(file, body, { encoding: 'binary' });
			await msg.react('🔉');
			const dispatcher = connection.playFile(file);
			dispatcher.once('end', () => this.finish(file, channel, msg));
			dispatcher.once('error', () => this.finish(file, channel, msg, true));
			return null;
		} catch (err) {
			await this.finish(file, channel, msg, true);
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async finish(file, channel, msg, fail = false) {
		try {
			if (fs.existsSync(file)) await fs.unlinkAsync(file);
			await msg.react(fail ? '⚠' : '✅');
		} finally {
			channel.leave();
		}
	}
};
