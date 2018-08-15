const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { XIAO_GITHUB_REPO_NAME, XIAO_GITHUB_REPO_USERNAME } = process.env;

module.exports = class InviteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'invite',
			aliases: ['join'],
			group: 'util',
			memberName: 'invite',
			description: 'Responds with the bot\'s invite links.',
			guarded: true
		});
	}

	run(msg) {
		return msg.say(stripIndents`
			You cannot invite me to your server, but you can join my home server to use me:
			${this.client.options.invite || 'Coming soon...'}

			You can also self-host me if you prefer:
			<https://github.com/${XIAO_GITHUB_REPO_USERNAME}/${XIAO_GITHUB_REPO_NAME}>
		`);
	}
};
