const Command = require('../../framework/Command');
const path = require('path');
const fs = require('fs');
const { letterTrans } = require('custom-translate');
const { WaveFile } = require('wavefile');
const { Readable } = require('stream');
const { reactIfAble } = require('../../util/Util');
const dictionary = require('../../assets/json/morse');
const { LOADING_EMOJI_ID } = process.env;

module.exports = class MorseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'morse',
			aliases: ['morse-code'],
			group: 'voice',
			memberName: 'morse',
			description: 'Converts text to morse code.',
			args: [
				{
					key: 'text',
					type: 'string',
					validate: text => {
						const translated = letterTrans(text.toLowerCase(), dictionary, ' ');
						if (translated.replace(/ {2}/g, ' / ').length < 2000) return true;
						return 'Invalid text, your text is too long.';
					},
					parse: text => text.toLowerCase()
				}
			]
		});

		this.library = fs.readFileSync(path.join(__dirname, '..', '..', 'assets', 'sounds', 'morse.wav'));
	}

	async run(msg, { text }) {
		const connection = this.client.dispatchers.get(msg.guild.id);
		if (!connection) {
			const usage = this.client.registry.commands.get('join').usage();
			return msg.reply(`I am not in a voice channel. Use ${usage} to fix that!`);
		}
		if (!connection.canPlay) return msg.reply('I am already playing audio in this server.');
		const translated = letterTrans(text.toLowerCase(), dictionary, ' ');
		await reactIfAble(msg, this.client.user, LOADING_EMOJI_ID, '💬');
		await msg.say(translated.replace(/ {2}/g, ' / '));
		connection.play(Readable.from([this.morse(text)]));
		await reactIfAble(msg, this.client.user, '🔉');
		return null;
	}

	morse(str) {
		const processedScript = this.processScript(str);
		const data = [];
		const sampleFreq = 8000;
		const timeUnitSecs = 0.06;
		const timeUnitSamples = Math.floor(timeUnitSecs * sampleFreq);
		let skip = false;
		for (let cIndex = 0; cIndex < processedScript.length; cIndex++) {
			if (skip) {
				skip = false;
				continue;
			}
			const c = processedScript[cIndex];
			if (c === '.') {
				for (let i = 0; i < timeUnitSamples; i++) {
					const libIndex = this.library[44 + i];
					data[(cIndex * timeUnitSamples) + i] = libIndex;
				}
			} else if (c === '-') {
				for (let i = 0; i < timeUnitSamples * 3; i++) {
					const libIndex = this.library[44 + timeUnitSamples + i];
					data[(cIndex * timeUnitSamples) + i] = libIndex;
				}
			} else if (c === ' ' && processedScript[cIndex + 1] === ' ') {
				for (let i = 0; i < timeUnitSamples * 7; i++) {
					data[(cIndex * timeUnitSamples) + i] = 127;
				}
				skip = true;
			} else {
				for (let i = 0; i < timeUnitSamples * 3; i++) {
					data[(cIndex * timeUnitSamples) + i] = 127;
				}
			}
		}
		const wav = new WaveFile();
		wav.fromScratch(1, sampleFreq, '8', data);
		return Buffer.from(wav.toBuffer());
	}

	processScript(str) {
		return str.replace(/[^.-]/gi, ' ').trim();
	}
};
