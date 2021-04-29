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
					key: 'id',
					prompt: 'What is the ID of the channel or user you would like to block?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { id }) {
		let channel;
		try {
			channel = await this.client.channels.fetch(id);
		} catch {
			channel = null;
		}
		let user;
		try {
			user = await this.client.users.fetch(id);
		} catch {
			user = null;
		}
		if (user) {
			return msg.say(stripIndents`
				__To block **${user.tag} (${user.id})** from DM calling and messages:__
				Place \`<xiao:phone:block:${user.id}>\` in this channel's topic
			`);
		}
		if (!channel) return msg.reply('Could not find any results.');
		return msg.say(stripIndents`
			__To block **#${channel.name} (${channel.id})**:__
			Just the channel: Place \`<xiao:phone:block:${channel.id}>\` in this channel's topic
			The entire server: Place \`<xiao:phone:block:${channel.guild.id}>\` in this channel's topic
		`);
	}
};
