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
			.filter(cmd => !isNaN(cmd.uses))
			.sort((a, b) => b.uses - a.uses)
			.map(cmd => `**${++i}.** ${cmd.name} (${cmd.uses} Uses)`)
			.slice((page - 1) * 10, page * 10);
		if (!list.length) return msg.say('This page does not exist.');
		return msg.say(list.join('\n'));
	}
};
