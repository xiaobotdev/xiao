const Command = require('../../structures/Command');

module.exports = class WhitelistCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'whitelist',
			aliases: ['blacklist-remove', 'blacklist-delete', 'unblacklist'],
			group: 'util',
			memberName: 'whitelist',
			description: 'Removes a user from the blacklist.',
			ownerOnly: true,
			args: [
				{
					key: 'user',
					prompt: 'What user do you want to whitelist?',
					type: 'user'
				}
			]
		});
	}

	run(msg, { user }) {
		if (this.client.isOwner(user)) return msg.reply('The bot owner cannot be blacklisted.');
		if (user.bot) return msg.reply('Bots cannot be blacklisted.');
		const blacklist = this.client.provider.get('global', 'blacklist', []);
		if (!blacklist.includes(user.id)) return msg.reply(`${user.tag} is not blacklisted!`);
		blacklist.splice(blacklist.indexOf(user.id), 1);
		if (!blacklist.length) this.client.provider.remove('global', 'blacklist');
		else this.client.provider.set('global', 'blacklist', blacklist);
		return msg.say(`${user.tag} has been whitelisted.`);
	}
};
