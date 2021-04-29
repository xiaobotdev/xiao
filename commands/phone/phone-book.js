const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class PhoneBookCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'phone-book',
			group: 'phone',
			memberName: 'phone-book',
			description: 'Looks up phone-enabled servers.',
			args: [
				{
					key: 'query',
					prompt: 'What server would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	run(msg, { query }) {
		const channels = this.client.channels.cache.filter(channel => {
			const search = query.toLowerCase();
			return channel.guild
				&& channel.topic
				&& channel.topic.includes('<xiao:phone>')
				&& channel.topic.includes('<xiao:phone-book>')
				&& (channel.guild.name.toLowerCase().includes(search) || channel.name.includes(search));
		});
		if (!channels.size) return msg.reply('Could not find any results.');
		return msg.say(stripIndents`
			__**Results:**__ _(${channels.size} Results${channels.size > 10 ? ', Showing 10' : ''})_
			${channels.map(c => `**${c.id}** (#${c.name}: ${c.guild.name})`).slice(0, 10).join('\n')}
		`);
	}
};
