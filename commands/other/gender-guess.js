const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');

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
					max: 1950,
					parse: name => encodeURIComponent(name)
				}
			]
		});
	}

	async run(msg, { name }) {
		try {
			const { body } = await snekfetch.get(`https://api.namsor.com/onomastics/api/json/gender/${name}/null`);
			if (body.gender === 'unknown') return msg.say(`I have no idea what gender ${body.firstName} is.`);
			return msg.say(`I'm ${Math.abs(body.scale * 100)}% sure ${body.firstName} is a ${body.gender} name.`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
