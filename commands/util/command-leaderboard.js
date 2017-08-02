const Command = require('../../structures/Command');

module.exports = class CommandLeaderboardCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'command-leaderboard',
			aliases: ['cmd-leaderboard', 'cmd-board'],
			group: 'util',
			memberName: 'command-leaderboard',
			description: 'Responds with the most used commands.',
			details: '**Note:** This only counts this session for this shard.',
			guarded: true,
			args: [
				{
					key: 'page',
					prompt: 'Which page do you want to view?',
					type: 'integer',
					default: 1
				}
			]
		});
	}

	run(msg, args) {
		const { page } = args;
		let i = 0;
		const list = this.client.registry.commands
			.sort((a, b) => a.uses - b.uses)
			.map(cmd => `**${++i}.** ${cmd.name} (${cmd.uses} Uses)`)
			.slice((page - 1) * 10, page * 10);
		return msg.say(list.split('\n'));
	}
};
