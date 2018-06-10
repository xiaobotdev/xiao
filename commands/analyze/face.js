const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { KAIROS_KEY, KAIROS_ID } = process.env;
const races = ['asian', 'black', 'hispanic', 'other', 'white'];

module.exports = class FaceAnalyzeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'face-analyze',
			aliases: ['analyze-face', 'face'],
			group: 'analyze',
			memberName: 'face',
			description: 'Determines the age, gender, and race of a face.',
			args: [
				{
					key: 'face',
					prompt: 'What face do you want to scan?',
					type: 'image'
				}
			]
		});
	}

	async run(msg, { face }) {
		try {
			const { body } = await request
				.post('https://api.kairos.com/detect')
				.set({
					app_id: KAIROS_ID,
					app_key: KAIROS_KEY
				})
				.send({ image: face });
			if (!body.images) return msg.reply('There are no faces in this image.');
			if (body.images[0].faces.length > 1) return msg.reply('Please provide only one face in the image.');
			const data = body.images[0].faces[0].attributes;
			const race = races.sort((a, b) => data[b] - data[a])[0];
			const gender = data.gender.maleConfidence > data.gender.femaleConfidence ? 'man' : 'woman';
			return msg.reply(`I think this is a photo of a ${data.age} year old ${race} ${gender}.`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
