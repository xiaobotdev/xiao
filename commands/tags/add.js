const Command = require('../../structures/Command');
const Tag = require('../../models/Tag');

module.exports = class TagAddCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tag-add',
			aliases: ['add-tag'],
			group: 'tags',
			memberName: 'add',
			description: 'Adds a tag for this server.',
			guildOnly: true,
			args: [
				{
					key: 'name',
					prompt: 'What should the name of the tag be?',
					type: 'string',
					max: 50,
					parse: name => name.toLowerCase()
				},
				{
					key: 'text',
					prompt: 'What should the content of the tag be?',
					type: 'string',
					max: 1000
				}
			]
		});
	}

	async run(msg, { name, text }) {
		const tag = await Tag.findOne({ where: { name, guildID: msg.guild.id } });
		if (tag) return msg.reply(`A tag with the name **${name}** already exists.`);
		await Tag.create({
			userID: msg.author.id,
			guildID: msg.guild.id,
			name,
			text
		});
		return msg.reply(`Added **${name}**.`);
	}
};
