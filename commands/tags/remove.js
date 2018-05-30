const Command = require('../../structures/Command');
const Tag = require('../../models/Tag');

module.exports = class TagRemoveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tag-remove',
			aliases: ['tag-delete', 'remove-tag', 'delete-tag'],
			group: 'tags',
			memberName: 'remove',
			description: 'Removes a tag from this server.',
			guildOnly: true,
			args: [
				{
					key: 'name',
					prompt: 'What is the name of the tag you want to remove?',
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
		if (!msg.channel.permissionsFor(msg.author).has('MANAGE_MESSAGES') && tag.userID !== msg.author.id) {
			return msg.reply('You can only delete your own tags.');
		}
		await tag.destroy();
		return msg.reply(`Removed **${name}**.`);
	}
};
