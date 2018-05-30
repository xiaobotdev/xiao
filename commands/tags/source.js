const Command = require('../../structures/Command');
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
					key: 'name',
					prompt: 'What is the name of the tag you want view the source of?',
					type: 'string',
					max: 50,
					parse: name => name.toLowerCase()
				}
			]
		});
	}

	async run(msg, { name }) {
		const tag = await Tag.findOne({ where: { name, guildID: msg.guild.id } });
		if (!tag) return msg.reply(`A tag with the name **${name}** doesn't exist.`);
		return msg.code('md', tag.text);
	}
};
