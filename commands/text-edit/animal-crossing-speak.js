const { Command } = require('discord.js-commando');
const path = require('path');
const fs = require('fs');
const { Writable } = require('stream');

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
			const stream = await this.joinLetters(text.split(''));
			const dispatcher = connection.playStream(stream);
			dispatcher.once('end', () => channel.leave());
			dispatcher.once('error', () => channel.leave());
			return null;
		} catch (err) {
			channel.leave();
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async joinLetters(letters) {
		let stream = new Writable();
		for (const letter of letters) {
			if (letter === ' ') continue;
			else if (!/[a-z0-9]/.test(letter)) stream = await this.addLetter(stream, 'unknown');
			else stream = await this.addLetter(stream, letter);
		}
		return stream;
	}

	addLetter(resultStream, letter) {
		const filePath = path.join(__dirname, '..', '..', 'assets', 'sounds', 'animal-crossing-speak', `${letter}.wav`);
		return new Promise((res, rej) => {
			const stream = fs.createReadStream(filePath);
			stream.pipe(resultStream, { end: false });
			stream.once('end', () => res(resultStream));
			stream.once('error', err => rej(err));
		});
	}
};
