const Command = require('../../framework/Command');
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
				usages: 2,
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
					type: 'string',
					validate: text => {
						if (!this.processScript(text)) return 'This text has no audible characters.';
						return true;
					}
				}
			]
		});

		this.library = fs.readFileSync(path.join(__dirname, '..', '..', 'assets', 'sounds', 'animalese.wav'));
	}

	async run(msg, { pitch, text }) {
		const connection = this.client.dispatchers.get(msg.guild.id);
		if (!connection) {
			const usage = this.client.registry.commands.get('join').usage();
			return msg.reply(`I am not in a voice channel. Use ${usage} to fix that!`);
		}
		if (!connection.canPlay) return msg.reply('I am already playing audio in this server.');
		await reactIfAble(msg, this.client.user, LOADING_EMOJI_ID, '💬');
		connection.play(Readable.from([this.animalese(text, pitch)]));
		await reactIfAble(msg, this.client.user, '🔉');
		return null;
	}

	animalese(script, pitch) {
		const processedScript = this.processScript(script);
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
		wav.fromScratch(1, sampleFreq, '8', data);
		return Buffer.from(wav.toBuffer());
	}

	processScript(str) {
		return str.replace(/[^a-z]/gi, ' ').trim();
	}
};
