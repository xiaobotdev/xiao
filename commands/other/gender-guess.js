const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { MASHAPE_KEY } = process.env;

module.exports = class GenderGuessCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'gender-guess',
			aliases: ['gender', 'guess-gender'],
			group: 'other',
			memberName: 'gender',
			description: 'Determines the gender of name.',
			args: [
				{
					key: 'name',
					prompt: 'What name do you want to determine the gender of?',
					type: 'string',
					parse: name => name.toLowerCase()
				}
			]
		});
	}

	async run(msg, { name }) {
		try {
			const { body } = await snekfetch
				.get('https://udayogra-find-gender-by-name-v1.p.mashape.com/analysis')
				.query({ firstname: name })
				.set({ 'X-Mashape-Key': MASHAPE_KEY });
			if (!body.male || !body.female) return msg.say(`I have no idea what gender ${body.name} is.`);
			const gender = body.male > body.female ? 'male' : 'female';
			return msg.say(`I'm ${body[gender]}% sure ${body.name} is a ${gender} name.`);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
