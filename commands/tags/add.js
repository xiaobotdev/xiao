const { Command } = require('discord.js-commando');
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
					key: 'id',
					prompt: 'What should the ID of the tag be?',
					type: 'string',
					max: 50,
					parse: id => id.toLowerCase()
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

	async run(msg, { id, text }) {
		const tag = await Tag.findOne({ where: { id, guildID: msg.guild.id } });
		if (tag) return msg.reply(`A tag with the ID **${id}** already exists.`);
		await Tag.create({
			userID: msg.author.id,
			guildID: msg.guild.id,
			id,
			text
		});
		return msg.reply(`Added the tag **${id}**.`);
	}
};
