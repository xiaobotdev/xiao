const Command = require('../../structures/Command');
const { stripInvites } = require('../../util/Util');
const { stripIndents } = require('common-tags');
const { PORTAL_EMOJI_ID, PORTAL_EMOJI_NAME } = process.env;

module.exports = class PortalSendCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'portal-send',
			aliases: ['portal'],
			group: 'other',
			memberName: 'portal-send',
			description: 'Send a message to a portal channel.',
			throttling: {
				usages: 1,
				duration: 30
			},
			args: [
				{
					key: 'message',
					prompt: 'What message would you like to send?',
					max: 1000,
					validate: (val, msg, arg) => {
						if (!val) return true;
						if (val.length > arg.max) {
							return `Please keep the ${arg.label} below or exactly ${arg.max} characters.`;
						}
						return true;
					},
					parse: val => val ? stripInvites(val) : '',
					isEmpty: (val, msg) => !msg.attachments.size && !val
				}
			]
		});
	}

	async run(msg, { message }) {
		let channels = this.client.channels.cache.filter(
			channel => channel.guild && channel.topic && channel.topic.includes('<xiao:portal>')
		);
		if (msg.guild) channels = channels.filter(channel => !msg.guild.channels.cache.has(channel.id));
		if (message.toLowerCase() === 'count') {
			return msg.say(`**${this.portalEmoji} ${channels.size}** currently open portals.`);
		}
		if (!channels.size) return msg.reply('No channels have an open portal...');
		const channel = channels.random();
		try {
			const displayName = msg.guild ? msg.guild.name : 'DM';
			const attachments = msg.attachments.size ? msg.attachments.map(a => a.url).join('\n') : null;
			await channel.send(stripIndents`
				**${this.portalEmoji} ${msg.author.tag} (${displayName}):** ${message}
				${attachments || ''}
			`);
			return msg.say(`Message sent to **${channel.name}** in **${channel.guild.name}**!`);
		} catch {
			return msg.reply('Failed to send the message. Try again later!');
		}
	}

	get portalEmoji() {
		return PORTAL_EMOJI_ID && PORTAL_EMOJI_NAME ? `<:${PORTAL_EMOJI_NAME}:${PORTAL_EMOJI_ID}>` : 'PORTAL';
	}
};
