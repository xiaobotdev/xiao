const Command = require('../../structures/Command');
const path = require('path');
const { reactIfAble, list } = require('../../util/Util');
const fs = require('fs');
const { WaveFile } = require('wavefile');
const { Readable } = require('stream');
const { LOADING_EMOJI_ID } = process.env;
const pitches = {
	low: 0.2,
	semilow: 0.5,
	medium: 1.0,
	semihigh: 1.5,
	high: 2
};

module.exports = class AnimaleseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'animalese',
			group: 'voice',
			memberName: 'animalese',
			description: 'Makes animalese based on text.',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 10
			},
			userPermissions: ['CONNECT', 'SPEAK'],
			credit: [
				{
					name: 'Acedio',
					url: 'https://github.com/Acedio',
					reason: 'Code, Sounds',
					reasonURL: 'https://github.com/Acedio/animalese.js'
				},
				{
					name: 'Nintendo',
					url: 'https://www.nintendo.com/',
					reason: 'Original "Animal Crossing" Game',
					reasonURL: 'https://animal-crossing.com/'
				}
			],
			args: [
				{
					key: 'pitch',
					prompt: `What pitch do you want to use? Either ${list(Object.keys(pitches, 'or'))}.`,
					type: 'string',
					oneOf: Object.keys(pitches),
					parse: pitch => pitches[pitch.toLowerCase()]
				},
				{
					key: 'text',
					prompt: 'What text should be said?',
					type: 'string'
				}
			]
		});

		this.library = fs.readFileSync(path.join(__dirname, '..', '..', 'assets', 'sounds', 'animalese.wav'));
	}

	async run(msg, { pitch, text }) {
		const connection = this.client.voice.connections.get(msg.guild.id);
		if (!connection) {
			const usage = this.client.registry.commands.get('join').usage();
			return msg.reply(`I am not in a voice channel. Use ${usage} to fix that!`);
		}
		if (this.client.dispatchers.has(msg.guild.id)) return msg.reply('I am already playing audio in this server.');
		await reactIfAble(msg, this.client.user, LOADING_EMOJI_ID, '💬');
		const dispatcher = connection.play(this.animalese(text, pitch));
		this.client.dispatchers.set(msg.guild.id, dispatcher);
		dispatcher.once('finish', () => this.client.dispatchers.delete(msg.guild.id));
		dispatcher.once('error', () => this.client.dispatchers.delete(msg.guild.id));
		await reactIfAble(msg, this.client.user, '🔉');
		return null;
	}

	animalese(script, pitch) {
		const processedScript = script.replace(/[^a-z]/gi, ' ').split(' ').map(this.shortenWord).join('');
		const data = [];
		const sampleFreq = 44100;
		const libraryLetterSecs = 0.15;
		const librarySamplesPerLetter = Math.floor(libraryLetterSecs * sampleFreq);
		const outputLetterSecs = 0.075;
		const outputSamplesPerLetter = Math.floor(outputLetterSecs * sampleFreq);
		for (let cIndex = 0; cIndex < processedScript.length; cIndex++) {
			const c = processedScript.toUpperCase()[cIndex];
			if (c >= 'A' && c <= 'Z') {
				const libraryLetterStart = librarySamplesPerLetter * (c.charCodeAt(0) - 'A'.charCodeAt(0));
				for (let i = 0; i < outputSamplesPerLetter; i++) {
					const libIndex = this.library[44 + libraryLetterStart + Math.floor(i * pitch)];
					data[(cIndex * outputSamplesPerLetter) + i] = libIndex;
				}
			} else {
				for (let i = 0; i < outputSamplesPerLetter; i++) {
					data[(cIndex * outputSamplesPerLetter) + i] = 127;
				}
			}
		}
		const wav = new WaveFile();
		wav.fromScratch(1, sampleFreq, '32', data);
		return Readable.from([wav.toBuffer()]);
	}

	shortenWord(str) {
		if (str.length > 1) {
			return str[0] + str[str.length - 1];
		}
		return str;
	}
};
