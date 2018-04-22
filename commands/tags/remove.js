const { Command } = require('discord.js-commando');
const Tag = require('../../models/Tag');

module.exports = class TagRemoveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tag-remove',
			aliases: ['tag-delete', 'remove-tag', 'delete-tag'],
			group: 'tags',
			memberName: 'remove',
			description: 'Removes a tag for this server.',
			guildOnly: true,
			args: [
				{
					key: 'id',
					prompt: 'What is the ID of the tag you want to remove?',
					type: 'string',
					max: 50,
					parse: id => id.toLowerCase()
				}
			]
		});
	}

	async run(msg, { id }) {
		const tag = await Tag.findOne({ where: { id, guildID: msg.guild.id } });
		if (!tag) return msg.reply(`A tag with the ID **${id}** doesn\'t exist.`);
		if (!msg.channel.permissionsFor(msg.author).has('MANAGE_MESSAGES') && tag.userID !== msg.author.id) {
			return msg.reply('You can only delete your own tags.');
		}
		await tag.destroy();
		return msg.reply(`Removed the tag **${id}**.`);
	}
};
