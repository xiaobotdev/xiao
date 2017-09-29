const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');

module.exports = class GenderGuessCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'gender-guess',
			aliases: ['gender', 'guess-gender'],
			group: 'random',
			memberName: 'gender',
			description: 'Determines the gender of name.',
			args: [
				{
					key: 'name',
					prompt: 'What name do you want to determine the gender of?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { name }) {
		try {
			const { body } = await snekfetch
				.get('https://api.genderize.io/')
				.query({ name });
			if (!body.gender) return msg.say(`I have no idea what gender ${body.name} is.`);
			return msg.say(`I'm ${Math.round(body.probability * 100)}% sure ${body.name} is a ${body.gender} name.`);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
