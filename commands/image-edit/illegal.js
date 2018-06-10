const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { wait } = require('../../util/Util');

module.exports = class IllegalCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'illegal',
			aliases: ['is-now-illegal', 'trump', 'first-order-of-business'],
			group: 'image-edit',
			memberName: 'illegal',
			description: 'Makes President Trump make your text illegal.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'text',
					prompt: 'What should the text of the bill be?',
					type: 'string',
					validate: text => {
						if (/^[a-zA-Z0-9 ]+$/g.test(text) && text.length < 11) return true;
						return 'Invalid text, please enter 10 or fewer basic unicode characters (A-Z, 0-9).';
					},
					parse: text => text.toUpperCase()
				}
			]
		});
	}

	async run(msg, { text }) {
		try {
			let gif = await this.fetchGIF(text);
			if (!gif) {
				await msg.say('Trump is busy signing the bill, please wait a moment...');
				await this.createGIF(text);
				gif = await this.fetchGIF(text);
				if (!gif) return msg.reply('Hmm... It seems Trump couldn\'t sign that bill...');
			}
			return msg.say({ files: [gif] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async createGIF(text) {
		const { body } = await request
			.post('https://is-now-illegal.firebaseio.com/queue/tasks.json')
			.send({
				task: 'gif',
				word: text
			});
		await wait(5000);
		return body;
	}

	async fetchGIF(text) {
		const { body } = await request.get(`https://is-now-illegal.firebaseio.com/gifs/${text}.json`);
		if (!body) return null;
		return body.url;
	}
};
