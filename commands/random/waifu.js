const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { shorten } = require('../../util/Util');

module.exports = class WaifuCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'waifu',
			aliases: ['this-waifu-does-not-exist'],
			group: 'random',
			memberName: 'waifu',
			description: 'Responds with a randomly generated waifu and backstory.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'This Waifu Does Not Exist',
					url: 'https://www.thiswaifudoesnotexist.net/',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		const num = Math.floor(Math.random() * 100000);
		const { text } = await request.get(`https://www.thiswaifudoesnotexist.net/snippet-${num}.txt`);
		const embed = new MessageEmbed()
			.setDescription(shorten(text, 1000))
			.setThumbnail(`https://www.thiswaifudoesnotexist.net/example-${num}.jpg`);
		return msg.embed(embed);
	}
};
