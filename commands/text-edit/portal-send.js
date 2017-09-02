const Command = require('../../structures/Command');
const { filterTopics } = require('../../structures/Util');

module.exports = class PortalSendCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'portal-send',
			group: 'text-edit',
			memberName: 'portal-send',
			description: 'Send a message to a random channel that has a portal open.',
			guildOnly: true,
			args: [
				{
					key: 'message',
					prompt: 'What message do you want to send?',
					type: 'string',
					validate: message => {
						if (message.length > 1500) return 'Message must be under 1500 characters.';
						if (!/discord(\.gg|app\.com\/invite|\.me)\//gi.test(message)) return true;
						return 'Please do not send invites.';
					}
				}
			]
		});
	}

	async run(msg, args) {
		const { message } = args;
		const channels = this.client.channels.filter(c => c.type === 'text' && c.guild.id !== msg.guild.id);
		const channel = filterTopics(channels, 'portal').random();
		if (!channel) return msg.say('Aww... No channel has an open portal...');
		try {
			await channel.send(`**${msg.author.tag} (${msg.guild.name}):** ${message}`);
			return msg.say(`Message sent to **${channel.guild.name}**!`);
		} catch (err) {
			return msg.say('Failed to send message...');
		}
	}
};
