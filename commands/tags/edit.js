const Command = require('../../structures/Command');
const Tag = require('../../models/Tag');

module.exports = class TagEditCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tag-edit',
			aliases: ['edit-tag'],
			group: 'tags',
			memberName: 'edit',
			description: 'Edits a tag in this server.',
			guildOnly: true,
			args: [
				{
					key: 'name',
					prompt: 'What is the name of the tag you want to edit?',
					type: 'string',
					max: 50,
					parse: name => name.toLowerCase()
				},
				{
					key: 'text',
					prompt: 'What should the new content of the tag be?',
					type: 'string',
					max: 1000
				}
			]
		});
	}

	async run(msg, { name, text }) {
		const tag = await Tag.findOne({ where: { name, guildID: msg.guild.id } });
		if (!tag) return msg.reply(`A tag with the name **${name}** doesn't exist.`);
		if (!msg.channel.permissionsFor(msg.author).has('MANAGE_MESSAGES') && tag.userID !== msg.author.id) {
			return msg.reply('You can only edit your own tags.');
		}
		await Tag.update({ text }, { where: { name, guildID: msg.guild.id } });
		return msg.reply(`Edited **${name}**.`);
	}
};
