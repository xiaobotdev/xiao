const Command = require('../../structures/Command');
const Docs = require('discord.js-docs');

module.exports = class DocstCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'docs',
			aliases: ['discord-js-docs', 'discord-js', 'djs', 'djs-docs'],
			group: 'search',
			memberName: 'docs',
			description: 'Searches the discord.js docs for your query.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What do you want to search the docs for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		const doc = await Docs.fetch('stable');
		const embed = doc.resolveEmbed(query);
		return msg.embed(embed);
	}
};
