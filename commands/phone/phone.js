const Command = require('../../structures/Command');
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
					key: 'channelID',
					prompt: 'What channel would you like to start a call with?',
					type: 'string',
					default: '',
					validate: channelID => {
						if (channelID.toLowerCase() === 'count') return true;
						return /^[0-9]+$/.test(channelID);
					},
					parse: channelID => channelID.toLowerCase()
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

	async run(msg, { channelID }) {
		if (channelID !== 'count' && (msg.guild && (!msg.channel.topic || !msg.channel.topic.includes('<xiao:phone>')))) {
			return msg.say('You can only start a call in a channel with `<xiao:phone>` in the topic.');
		}
		if (channelID !== 'count' && this.client.inPhoneCall(msg.channel)) {
			return msg.say('This channel is already in a phone call.');
		}
		const channels = this.client.channels.cache.filter(channel => channel.guild
			&& channel.topic
			&& channel.topic.includes('<xiao:phone>')
			&& !channel.topic.includes('<xiao:phone:no-random>')
			&& !this.client.isBlockedFromPhone(msg.channel, channel, msg.author)
			&& (msg.guild ? !msg.guild.channels.cache.has(channel.id) : true)
			&& (channelID ? true : !this.client.inPhoneCall(channel)));
		if (!channels.size) return msg.reply('No channels currently allow phone calls...');
		let channel;
		if (channelID) {
			if (channelID === 'count') return msg.say(`☎️ **${channels.size}** currently open lines.`);
			channel = this.client.channels.cache.get(channelID);
			const user = this.client.users.cache.get(channelID);
			if (user) return msg.reply('You cannot call DM channels.');
			if (!channel || !channel.guild) return msg.reply('That channel does not exist.');
			if (!channel.topic || !channel.topic.includes('<xiao:phone>')) {
				return msg.reply('That channel does not allow phone calls.');
			}
			if (this.client.inPhoneCall(channel)) return msg.reply('That channel is already in a call.');
			if (this.client.isBlockedFromPhone(msg.channel, channel, msg.author)) {
				return msg.reply('That channel has blocked this channel from calling them.');
			}
		} else {
			channel = channels.random();
		}
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
