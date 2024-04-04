const Command = require('../../framework/Command');
const path = require('path');
const { letterTrans } = require('custom-translate');
const { reactIfAble, delay } = require('../../util/Util');
const dictionary = require('../../assets/json/morse');

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
						if (letterTrans(text.toLowerCase(), dictionary, ' ').length < 2000) return true;
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
		const translated = letterTrans(text, dictionary, ' ');
		const letters = translated.split('');
		let skip = false;
		await reactIfAble(msg, this.client.user, '🔉');
		for (let i = 0; i < letters.length; i++) {
			if (skip) {
				skip = false;
				continue;
			}
			const letter = letters[i];
			if (letter === '.') {
				connection.play(path.join(__dirname, '..', '..', 'sounds', 'morse', 'dot.wav'));
				await delay(1000);
				continue;
			}
			if (letter === '-') {
				connection.play(path.join(__dirname, '..', '..', 'sounds', 'morse', 'dash.wav'));
				await delay(1000);
				continue;
			}
			if (letter === ' ' && letters[i + 1] === ' ') {
				skip = true;
				await delay(7000);
				continue;
			}
			await delay(3000);
		}
		return null;
	}
};
