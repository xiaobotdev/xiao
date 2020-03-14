const Command = require('../../structures/Command');
const { PORTAL_EMOJI_ID, PORTAL_EMOJI_NAME } = process.env;

module.exports = class PortalSendCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'portal-send',
			aliases: ['portal'],
			group: 'other',
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
		let channels = this.client.channels.cache.filter(
			channel => channel.type === 'text' && channel.topic && channel.topic.includes('<xiao:portal>')
		);
		if (msg.channel.type === 'text') {
			channels = channels.filter(channel => !msg.guild.channels.cache.has(channel.id));
		}
		if (message.toLowerCase() === 'count') {
			return msg.say(`**${this.portalEmoji} ${channels.size}** currently open portals.`);
		}
		if (!channels.size) return msg.reply('No channels have an open portal...');
		const channel = channels.random();
		try {
			const displayName = msg.channel.type === 'text' ? msg.guild.name : 'DM';
			await channel.send(`**${this.portalEmoji} ${msg.author.tag} (${displayName}):** ${message}`);
			return msg.say(`Message sent to **${channel.name}** in **${channel.guild.name}**!`);
		} catch {
			return msg.reply('Failed to send the message. Try again later!');
		}
	}

	get portalEmoji() {
		return PORTAL_EMOJI_ID && PORTAL_EMOJI_NAME ? `<:${PORTAL_EMOJI_NAME}:${PORTAL_EMOJI_ID}>` : 'PORTAL';
	}
};
