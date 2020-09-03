const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class PhoneBlockCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'phone-block',
			aliases: ['call-block'],
			group: 'phone',
			memberName: 'phone-block',
			description: 'Gives instructions for blocking a channel or server.',
			guildOnly: true,
			args: [
				{
					key: 'query',
					prompt: 'What channel would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	run(msg, { query }) {
		const channels = this.client.channels.cache.filter(channel => {
			const search = query.toLowerCase();
			return channel.guild && (channel.name.includes(search) || channel.id === search);
		});
		if (!channels.size) return msg.reply('Could not find any results.');
		if (channels.size > 1) return msg.reply(`Found ${channels.size} channels, please be more specific (or use ID).`);
		const channel = channels.first();
		return msg.say(stripIndents`
			__To block **#${channel.name} (${channel.id})**:__
			Just the channel: Place \`<xiao:phone:block:${channel.id}>\` in this channel's topic
			The entire server: Place \`<xiao:phone:block:${channel.guild.id}>\` in this channel's topic
		`);
	}
};
