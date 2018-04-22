const { Command } = require('discord.js-commando');
const Tag = require('../../models/Tag');

module.exports = class TagCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tag',
			group: 'tags',
			memberName: 'tag',
			description: 'Responds with a tag in this server.',
			guildOnly: true,
			args: [
				{
					key: 'name',
					prompt: 'What is the name of the tag you want view?',
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
		return msg.say(tag.text);
	}
};
