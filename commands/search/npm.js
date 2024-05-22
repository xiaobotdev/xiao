const Command = require('../../framework/Command');
const moment = require('moment');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const request = require('node-superfetch');
const { trimArray } = require('../../util/Util');
const logos = require('../../assets/json/logos');

module.exports = class NPMCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'npm',
			group: 'search',
			description: 'Responds with information on an NPM package.',
			clientPermissions: [PermissionFlagsBits.EmbedLinks],
			credit: [
				{
					name: 'npm',
					url: 'https://www.npmjs.com/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'pkg',
					label: 'package',
					type: 'string',
					parse: pkg => encodeURIComponent(pkg.replaceAll(' ', '-'))
				}
			]
		});
	}

	async run(msg, { pkg }) {
		try {
			const { body } = await request.get(`https://registry.npmjs.com/${pkg}`);
			if (body.time.unpublished) return msg.say('This package no longer exists.');
			const version = body.versions[body['dist-tags'].latest];
			const maintainers = trimArray(body.maintainers.map(user => user.name));
			const dependencies = version.dependencies ? trimArray(Object.keys(version.dependencies)) : null;
			const embed = new EmbedBuilder()
				.setColor(0xCB0000)
				.setAuthor({ name: 'NPM', iconURL: logos.npm, url: 'https://www.npmjs.com/' })
				.setTitle(body.name)
				.setURL(`https://www.npmjs.com/package/${pkg}`)
				.setDescription(body.description || 'No description.')
				.addField('❯ Version', body['dist-tags'].latest, true)
				.addField('❯ License', body.license || 'None', true)
				.addField('❯ Author', body.author ? body.author.name : '???', true)
				.addField('❯ Creation Date', moment.utc(body.time.created).format('MM/DD/YYYY h:mm A'), true)
				.addField('❯ Modification Date', moment.utc(body.time.modified).format('MM/DD/YYYY h:mm A'), true)
				.addField('❯ Main File', version.main || 'index.js', true)
				.addField('❯ Dependencies', dependencies && dependencies.length ? dependencies.join(', ') : 'None')
				.addField('❯ Maintainers', maintainers.join(', '));
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			throw err;
		}
	}
};
