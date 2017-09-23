const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { stripIndents } = require('common-tags');
const { list } = require('../../structures/Util');
const genders = ['male', 'female', 'both'];

module.exports = class RandomPersonCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'random-person',
			group: 'random-res',
			memberName: 'random-person',
			description: 'Responds with a randomly generated person.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'gender',
					prompt: `What gender do you want to generate a name for? Either ${list(genders, 'or')}.`,
					type: 'string',
					default: 'both'
				}
			]
		});
	}

	async run(msg, { gender }) {
		try {
			const { body } = await snekfetch
				.get('https://randomuser.me/api/')
				.query({
					gender,
					noinfo: ''
				});
			const data = body.results[0];
			const embed = new MessageEmbed()
				.setColor(0x9797FF)
				.setThumbnail(data.picture.large)
				.addField('❯ First Name',
					data.name.first.toUpperCase(), true)
				.addField('❯ Last Name',
					data.name.last.toUpperCase(), true)
				.addField('❯ Title',
					data.name.title.toUpperCase(), true)
				.addField('❯ Gender',
					data.gender.toUpperCase(), true)
				.addField('❯ Username',
					data.login.username, true)
				.addField('❯ Password',
					data.login.password, true)
				.addField('❯ Email',
					data.email, true)
				.addField('❯ Phone',
					data.phone, true)
				.addField('❯ Cell',
					data.cell, true)
				.addField('❯ Birthday',
					new Date(data.dob).toDateString(), true)
				.addField('❯ Address',
					stripIndents`
						${data.location.street.toUpperCase()}
						${data.location.city.toUpperCase()}, ${data.location.state.toUpperCase()} ${data.location.postcode}
					`);
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
