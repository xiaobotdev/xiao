const Command = require('../../structures/Command');

module.exports = class PortalSendCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'portal-send',
			aliases: ['send-portal-message', 'portal-message', 'send-portal-msg', 'portal-msg', 'portal'],
			group: 'text-edit',
			memberName: 'portal-send',
			description: 'Send a message to a portal channel.',
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
		let channels = this.client.channels.filter(
			channel => channel.type === 'text' && channel.topic && channel.topic.includes('<portal>')
		);
		if (msg.channel.type === 'text') channels = channels.filter(channel => !msg.guild.channels.has(channel.id));
		if (!channels.size) return msg.reply('No channels have an open portal...');
		const channel = channels.random();
		try {
			await channel.send(`**${msg.author.tag} (${msg.channel.type === 'text' ? msg.guild.name : 'DM'}):** ${message}`);
			return msg.say(`Message sent to **${channel.name}** in **${channel.guild.name}**!`);
		} catch (err) {
			return msg.reply('Failed to send the message. Try again later!');
		}
	}
};
