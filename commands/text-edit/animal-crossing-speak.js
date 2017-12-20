const { Command } = require('discord.js-commando');
const path = require('path');
const { wait } = require('../../util/Util');

module.exports = class AnimalCrossingSpeakCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'animal-crossing-speak',
			aliases: ['animal-crossing-speech', 'ac-speak', 'ac-speech'],
			group: 'text-edit',
			memberName: 'animal-crossing-speak',
			description: 'Converts text to Animal Crossing Speak.',
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
					parse: text => text.toLowerCase()
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
		try {
			const connection = await channel.join();
			for (const letter of text.split('')) {
				if (letter === ' ') await wait(500);
				else if (!/[a-z0-9]/.test(letter)) await this.playLetter(connection, 'unknown');
				else await this.playLetter(connection, letter);
			}
			channel.leave();
			return null;
		} catch (err) {
			channel.leave();
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	playLetter(connection, letter) {
		const letterPath = path.join(__dirname, '..', '..', 'assets', 'sounds', 'animal-crossing-speak', `${letter}.wav`);
		return new Promise((res, rej) => {
			const dispatcher = connection.playFile(letterPath);
			dispatcher.once('end', reason => res(reason));
			dispatcher.once('error', err => rej(err));
		});
	}
};
