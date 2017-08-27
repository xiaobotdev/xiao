const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');
const { stripIndents } = require('common-tags');
const { DBOTSORG_KEY } = process.env;

module.exports = class UpvoteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'upvote',
			aliases: ['upvoters', 'updoot'],
			group: 'util',
			memberName: 'upvote',
			description: 'Responds with Xiao\'s upvoters on Discord Bots.',
			guarded: true
		});
	}

	async run(msg) {
		try {
			const { body } = await snekfetch
				.get(`https://discordbots.org/api/bots/${this.client.user.id}/votes`)
				.set({ Authorization: DBOTSORG_KEY });
			return msg.say(stripIndents`
				Upvote Xiao and get rewards while joining ${body.length} others!
				<https://discordbots.org/bot/xiaobot>
			`);
		} catch (err) {
			return msg.say(stripIndents`
				Upvote Xiao and get rewards!
				<https://discordbots.org/bot/xiaobot>
			`);
		}
	}
};
