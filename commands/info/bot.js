const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const moment = require('moment');
const { embedURL, formatNumber } = require('../../util/Util');

module.exports = class BotCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'bot',
			aliases: ['discord-bot', 'bot-info', 'discord-bot-info'],
			group: 'info',
			memberName: 'bot',
			description: 'Responds with information on a Discord bot.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Discord Bots',
					url: 'https://discord.bots.gg/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'user',
					prompt: 'What bot would you like to get information on?',
					type: 'user'
				}
			]
		});
	}

	async run(msg, { user }) {
		if (!user.bot) return msg.say('This user is not a bot.');
		try {
			const { body } = await request.get(`https://discord.bots.gg/api/v1/bots/${user.id}`);
			const avatar = body.avatarURL === '/img/bot_icon_placeholder.png'
				? 'https://discord.bots.gg/img/bot_icon_placeholder.png'
				: body.avatarURL;
			const embed = new MessageEmbed()
				.setColor(0x000001)
				.setTitle(`${body.username} by ${body.owner.username}#${body.owner.discriminator}`)
				.setDescription(body.shortDescription)
				.setAuthor('Discord Bots', 'https://i.imgur.com/OhZCqVd.jpg', 'https://discord.bots.gg/')
				.setThumbnail(avatar)
				.setURL(`https://discord.bots.gg/bots/${user.id}`)
				.setFooter(user.id)
				.addField('❯ Prefix', body.prefix || '???', true)
				.addField('❯ Library', body.libraryName || '???', true)
				.addField('❯ Servers', body.guildCount ? formatNumber(body.guildCount) : '???', true)
				.addField('❯ Invite', body.botInvite ? embedURL('Here', body.botInvite) : '???', true)
				.addField('❯ Server', body.supportInvite ? embedURL('Here', body.supportInvite) : '???', true)
				.addField('❯ Public List Date', moment.utc(body.addedDate).format('MM/DD/YYYY h:mm A'), true);
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 404) return msg.say('This bot is not publicly listed.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
