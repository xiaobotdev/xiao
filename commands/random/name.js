const { Command } = require('discord.js-commando');
const { list } = require('../../util/Util');
const names = require('../../assets/json/name');
const all = [].concat(names.male, names.female);
const genders = ['male', 'female', 'both'];

module.exports = class NameCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'name',
			group: 'random',
			memberName: 'name',
			description: 'Responds with a random name, with the gender of your choice.',
			args: [
				{
					key: 'gender',
					prompt: `Which gender do you want to generate a name for? Either ${list(genders, 'or')}.`,
					type: 'string',
					default: 'both',
					validate: gender => {
						if (genders.includes(gender.toLowerCase())) return true;
						return `Invalid gender, please enter either ${list(genders, 'or')}.`;
					},
					parse: gender => gender.toLowerCase()
				}
			]
		});
	}

	run(msg, { gender }) {
		const lastName = names.last[Math.floor(Math.random() * names.last.length)];
		if (gender === 'both') return msg.say(`${all[Math.floor(Math.random() * all.length)]} ${lastName}`);
		return msg.say(`${names[gender][Math.floor(Math.random() * names[gender].length)]} ${lastName}`);
	}
};
