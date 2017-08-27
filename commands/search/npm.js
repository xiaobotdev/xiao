const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const moment = require('moment');
const { shorten } = require('../../structures/Util');

module.exports = class NPMCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'npm',
			group: 'search',
			memberName: 'npm',
			description: 'Searches NPM for info on an NPM package.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What package would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		const { query } = args;
		try {
			const { body } = await snekfetch
				.get(`https://registry.npmjs.com/${query}`);
			const embed = new MessageEmbed()
				.setColor(0xCB0000)
				.setAuthor('NPM', 'https://i.imgur.com/BCODHXd.png')
				.setTitle(body.name)
				.setURL(`https://www.npmjs.com/package/${query}`)
				.setDescription(body.description || 'No Description.')
				.addField('❯ Version',
					body['dist-tags'].latest, true)
				.addField('❯ License',
					body.license || 'None', true)
				.addField('❯ Author',
					body.author ? body.author.name : 'Unknown', true)
				.addField('❯ Created',
					moment(body.time.created).format('MMMM Do YYYY'), true)
				.addField('❯ Modified',
					moment(body.time.modified).format('MMMM Do YYYY'), true)
				.addField('❯ Main File',
					body.versions[body['dist-tags'].latest].main, true)
				.addField('❯ Keywords',
					body.keywords && body.keywords.length ? shorten(body.keywords.join(', '), 1000) : 'None')
				.addField('❯ Maintainers',
					body.maintainers.map(user => user.name).join(', '));
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
