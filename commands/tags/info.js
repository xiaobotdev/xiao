const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const Tag = require('../../models/Tag');

module.exports = class TagInfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tag-info',
			group: 'tags',
			memberName: 'info',
			description: 'Responds with detailed information on a tag in this server.',
			guildOnly: true,
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'id',
					prompt: 'What is the ID of the tag you want to get information on?',
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
		let author;
		try {
			const authorUser = await this.client.users.fetch(tag.userID);
			author = authorUser.tag;
		} catch (err) {
			author = '???';
		}
		const embed = new MessageEmbed()
			.setColor(0x00AE86)
			.setThumbnail(msg.guild.iconURL())
			.addField('❯ ID', tag.id, true)
			.addField('❯ Author', author, true)
			.addField('❯ Created On', new Date(tag.createdAt).toDateString(), true)
			.addField('❯ Modified On', new Date(tag.updatedAt).toDateString(), true);
		return msg.embed(embed);
	}
};
