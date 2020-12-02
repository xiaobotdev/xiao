const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class PhoneInfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'phone-info',
			aliases: ['call-info', 'phone-call-info'],
			group: 'phone',
			memberName: 'phone-info',
			description: 'Gives information on the current phone call.'
		});
	}

	run(msg) {
		const origin = this.client.phone.find(call => call.origin.id === msg.channel.id);
		const recipient = this.client.phone.find(call => call.recipient.id === msg.channel.id);
		if (!origin && !recipient) return msg.reply('☎️ This channel is not in a phone call.');
		const call = origin || recipient;
		if (!call.active) return msg.reply('☎️ This call is not currently active.');
		const otherChannel = msg.channel.id === call.origin.id ? call.recipient : call.origin;
		const otherChannelDM = msg.channel.id === call.origin.id ? false : Boolean(call.origin.guild);
		const embed = new MessageEmbed()
			.setColor(0x00AE86)
			.setThumbnail(otherChannel.guild.iconURL({ format: 'png' }))
			.addField('❯ Recipient Channel',
				otherChannelDM ? `@${call.origin.startUser.tag}` : `#${otherChannel.name}`, true)
			.addField('❯ Recipient Server', otherChannelDM ? 'DM' : otherChannel.guild.name, true)
			.addField('❯ Recipient ID', otherChannel.id, true)
			.addField('❯ Call Duration', call.durationDisplay, true)
			.addField('❯ Admin Call?', call.adminCall ? 'Yes' : 'No', true)
			.addField('❯ Started By', call.startUser.tag, true);
		return msg.embed(embed);
	}
};
