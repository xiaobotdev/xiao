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
		const { body } = await snekfetch
			.get(`https://discordbots.org/api/bots/${this.client.user.id}/votes`)
			.set({ Authorization: DBOTSORG_KEY });
		const haste = await snekfetch
			.post('https://hastebin.com/documents')
			.send(body.map(user => `${user.username}#${user.discriminator}`).join('\n'));
		return msg.say(stripIndents`
			Upvote Xiao and get rewards while joining ${body.length} others!
			<https://discordbots.org/bot/${this.client.user.id}>
			List of Upvoters: <https://hastebin.com/${haste.body.key}>
		`);
	}
};
