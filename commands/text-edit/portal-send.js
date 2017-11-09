const { Command } = require('discord.js-commando');

module.exports = class PortalSendCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'portal-send',
			aliases: ['send-portal-message', 'portal-message', 'send-portal-msg', 'portal-msg'],
			group: 'text-edit',
			memberName: 'portal-send',
			description: 'Send a message to a random channel with "<portal>" in the topic.',
			guildOnly: true,
			args: [
				{
					key: 'message',
					prompt: 'What message would you like to send?',
					type: 'string',
					max: 1000
				}
			]
		});
	}

	async run(msg, { message }) {
		if (/discord(\.gg|app\.com\/invite|\.me)\//gi.test(message)) return msg.reply('Please do not send invites.');
		const valid = this.client.channels.filter(channel => channel.type === 'text' && channel.guild.id !== msg.guild.id);
		const channels = valid.filter(channel => channel.topic && channel.topic.toLowerCase().includes('<portal>'));
		if (!channels.size) return msg.say('No channels have an open portal.');
		const channel = channels.random();
		try {
			await channel.send(`**${msg.author.tag} (${msg.guild.name})**: ${message}`);
			return msg.say(`Message sent to **${channel.name}** in **${channel.guild.name}**!`);
		} catch (err) {
			return msg.reply('Failed to send the message. Try again later!');
		}
	}
};
