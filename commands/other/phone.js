const Command = require('../../structures/Command');
const PhoneCall = require('../../structures/phone/PhoneCall');

module.exports = class PhoneCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'phone',
			aliases: ['phone-call'],
			group: 'other',
			memberName: 'phone',
			description: 'Starts a phone call with a random server.',
			guildOnly: true,
			args: [
				{
					key: 'count',
					prompt: 'Would you like to get the count of channels?',
					type: 'boolean',
					default: false
				}
			],
			credit: [
				{
					name: 'Tatsumaki',
					url: 'https://tatsumaki.xyz/',
					reason: 'Concept'
				}
			]
		});
	}

	async run(msg, { count }) {
		if (!msg.channel.topic || !msg.channel.topic.includes('<xiao:phone>')) {
			return msg.say('You can only start a call in a channel with `<xiao:phone>` in the topic.');
		}
		if (this.client.phone.some(call => [call.origin.id, call.recipient.id].includes(msg.channel.id))) {
			return msg.say('This channel is already in a phone call.');
		}
		const channels = this.client.channels.cache.filter(channel => channel.type === 'text'
			&& channel.topic
			&& channel.topic.includes('<xiao:phone>')
			&& !msg.guild.channels.cache.has(channel.id));
		if (count) return msg.say(`☎️ **${channels.size}** currently open lines.`);
		if (!channels.size) return msg.reply('No channels currently allow phone calls...');
		const channel = channels.random();
		try {
			const id = `${msg.channel.id}:${channel.id}`;
			this.client.phone.set(id, new PhoneCall(this.client, msg.channel, channel));
			await this.client.phone.get(id).start();
			return null;
		} catch {
			return msg.reply('Failed to start the call. Try again later!');
		}
	}
};
