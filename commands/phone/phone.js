const Command = require('../../framework/Command');
const PhoneCall = require('../../structures/phone/PhoneCall');

module.exports = class PhoneCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'phone',
			aliases: ['phone-call', 'call'],
			group: 'phone',
			memberName: 'phone',
			description: 'Starts a phone call with a random server.',
			throttling: {
				usages: 1,
				duration: 45
			},
			args: [
				{
					key: 'count',
					type: 'string',
					default: '',
					parse: count => count.toLowerCase()
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
		if (count !== 'count' && (msg.guild && (!msg.channel.topic || !msg.channel.topic.includes('<xiao:phone>')))) {
			return msg.say('You can only start a call in a channel with `<xiao:phone>` in the topic.');
		}
		if (count !== 'count' && this.client.phone.inCall(msg.channel)) {
			return msg.say('This channel is already in a phone call.');
		}
		const channels = this.client.channels.cache.filter(channel => channel.guild
			&& channel.topic
			&& channel.topic.includes('<xiao:phone>')
			&& !this.client.phone.isBlocked(msg.channel, channel, msg.author)
			&& (msg.guild ? !msg.guild.channels.cache.has(channel.id) : true)
			&& !this.client.phone.inCall(channel));
		if (count === 'count') return msg.say(`☎️ **${channels.size}** currently open lines.`);
		if (!channels.size) return msg.reply('No channels currently allow phone calls...');
		const channel = channels.random();
		try {
			const id = `${msg.guild ? msg.channel.id : msg.author.id}:${channel.id}`;
			this.client.phone.set(id, new PhoneCall(this.client, msg.author, msg.channel, channel));
			await this.client.phone.get(id).start();
			return null;
		} catch {
			const id = `${msg.guild ? msg.channel.id : msg.author.id}:${channel.id}`;
			this.client.phone.delete(id);
			return msg.reply('Failed to start the call. Try again later!');
		}
	}
};
