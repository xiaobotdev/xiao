const Command = require('../../framework/Command');
const path = require('path');
const { letterTrans } = require('custom-translate');
const { reactIfAble, delay } = require('../../util/Util');
const dictionary = require('../../assets/json/morse');
const { SUCCESS_EMOJI_ID } = process.env;

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
	}

	async run(msg, { text }) {
		const connection = this.client.dispatchers.get(msg.guild.id);
		if (!connection) {
			const usage = this.client.registry.commands.get('join').usage();
			return msg.reply(`I am not in a voice channel. Use ${usage} to fix that!`);
		}
		if (!connection.canPlay) return msg.reply('I am already playing audio in this server.');
		const translated = letterTrans(text.toLowerCase(), dictionary, ' ');
		await msg.say(translated.replace(/ {2}/g, ' / '));
		const letters = translated.split('');
		let skip = false;
		await reactIfAble(msg, this.client.user, '🔉');
		for (let i = 0; i < letters.length; i++) {
			if (skip) {
				skip = false;
				continue;
			}
			const letter = letters[i];
			const timeUnit = 60;
			if (letter === '.') {
				connection.play(path.join(__dirname, '..', '..', 'assets', 'sounds', 'morse', 'dot.mp3'));
				await delay(timeUnit * 2);
				continue;
			}
			if (letter === '-') {
				connection.play(path.join(__dirname, '..', '..', 'assets', 'sounds', 'morse', 'dash.mp3'));
				await delay(timeUnit * 4);
				continue;
			}
			if (letter === ' ' && letters[i + 1] === ' ') {
				skip = true;
				await delay(timeUnit * 7);
				continue;
			}
			await delay(timeUnit * 3);
		}
		await reactIfAble(msg, msg.author, SUCCESS_EMOJI_ID, '✅');
		return null;
	}
};
