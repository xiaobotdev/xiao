const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');

module.exports = class GenderGuessCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'gender-guess',
			aliases: ['gender', 'guess-gender'],
			group: 'other',
			memberName: 'gender',
			description: 'Determines the gender of a name.',
			args: [
				{
					key: 'first',
					label: 'first name',
					prompt: 'What first name do you want to determine the gender of?',
					type: 'string',
					max: 500,
					parse: first => encodeURIComponent(first)
				},
				{
					key: 'last',
					label: 'last name',
					prompt: 'What last name do you want to determine the gender of?',
					type: 'string',
					default: 'null',
					max: 500,
					parse: last => encodeURIComponent(last)
				}
			]
		});
	}

	async run(msg, { first, last }) {
		try {
			const { body } = await snekfetch.get(`https://api.namsor.com/onomastics/api/json/gender/${first}/${last}`);
			if (body.gender === 'unknown') return msg.say(`I have no idea what gender ${body.firstName} is.`);
			return msg.say(`I'm ${Math.abs(body.scale * 100)}% sure ${body.firstName} is a ${body.gender} name.`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
