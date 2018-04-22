const { Command } = require('discord.js-commando');
const Tag = require('../../models/Tag');

module.exports = class TagSourceCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tag-source',
			group: 'tags',
			memberName: 'source',
			description: 'Responds with the base markdown of a tag in this server.',
			guildOnly: true,
			args: [
				{
					key: 'id',
					prompt: 'What is the ID of the tag you want view the source of?',
					type: 'string',
					max: 50,
					parse: id => id.toLowerCase()
				}
			]
		});
	}

	async run(msg, { id }) {
		const tag = await Tag.findOne({ where: { id, guildID: msg.guild.id } });
		if (!tag) return msg.reply(`A tag with the ID **${id}** doesn't exist.`);
		return msg.code('md', tag.text);
	}
};
