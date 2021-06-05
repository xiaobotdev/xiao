const Command = require('../../framework/Command');
const request = require('node-superfetch');

module.exports = class LoremPicsumCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lorem-picsum',
			aliases: ['lorem-p', 'picsum'],
			group: 'random-img',
			memberName: 'lorem-picsum',
			description: 'Responds with a random image of a certain size.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Lorem Picsum',
					url: 'https://picsum.photos/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'width',
					prompt: 'What do you want the width of the image to be?',
					type: 'integer',
					max: 2000,
					min: 10
				},
				{
					key: 'height',
					prompt: 'What do you want the height of the image to be?',
					type: 'integer',
					max: 2000,
					min: 10
				},
				{
					key: 'seed',
					prompt: 'What seed do you want to provide for image generation?',
					type: 'string',
					default: '',
					max: 100,
					parse: seed => encodeURIComponent(seed)
				}
			]
		});
	}

	async run(msg, { width, height, seed }) {
		try {
			const { body } = await request.get(`https://picsum.photos/${seed ? `seed/${seed}/` : ''}${width}/${height}`);
			return msg.say({ files: [{ attachment: body, name: `${width}x${height}.jpg` }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
