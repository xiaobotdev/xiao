const Command = require('../../framework/Command');
const request = require('node-superfetch');

module.exports = class FaceGenderCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'face-gender',
			aliases: ['guess-face-gender', 'face-gender-guess', 'gender-face', 'gender'],
			group: 'analyze',
			description: 'Determines the gender of a face.',
			credit: [
				{
					name: 'Nyckel',
					url: 'https://www.nyckel.com/pretrained-classifiers/gender-detector/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'image',
					type: 'image'
				}
			]
		});
	}

	async run(msg, { image }) {
		const { body } = await request
			.post(`https://www.nyckel.com/v1/functions/gender-detector/invoke`)
			.send({ data: image });
		return msg.say(`I'm ${Math.round(body.confidence * 100)}% sure this is a **${body.labelName}**.`);
	}
};
