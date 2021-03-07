const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { list } = require('../../util/Util');
const products = require('../../assets/json/apple-engraving');

module.exports = class AppleEngravingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'apple-engraving',
			aliases: ['apple-engrave', 'apple-e', 'a-engrave', 'a-engraving'],
			group: 'edit-image-text',
			memberName: 'apple-engraving',
			description: 'Engraves the text of your choice onto an Apple product.',
			details: `**Products:** ${Object.keys(products).join(', ')}`,
			credit: [
				{
					name: 'Apple',
					url: 'https://www.apple.com/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'product',
					prompt: `What product do you want to engrave? Either ${list(Object.keys(products), 'or')}.`,
					type: 'string',
					oneOf: Object.keys(products),
					parse: product => product.toLowerCase()
				},
				{
					key: 'text',
					prompt: 'What text do you want to engrave?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { product, text }) {
		try {
			const { body } = await request
				.get(`https://www.apple.com/shop/preview/engrave/${products[product]}/A`)
				.query({
					th: text,
					s: 2,
					f: 'font1'
				});
			return msg.say({ files: [{ attachment: body, name: 'apple-engraving.jpg' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
