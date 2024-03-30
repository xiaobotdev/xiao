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
					type: 'integer',
					max: 2000,
					min: 10
				},
				{
					key: 'height',
					type: 'integer',
					max: 2000,
					min: 10
				},
				{
					key: 'seed',
					type: 'string',
					default: '',
					max: 100,
					parse: seed => encodeURIComponent(seed)
				}
			]
		});
	}

	async run(msg, { width, height, seed }) {
		const { body } = await request.get(`https://picsum.photos/${seed ? `seed/${seed}/` : ''}${width}/${height}`);
		return msg.say({ files: [{ attachment: body, name: `${width}x${height}.jpg` }] });
	}
};
