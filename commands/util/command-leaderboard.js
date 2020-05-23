const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class CommandLeaderboardCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'command-leaderboard',
			aliases: ['cmd-lb', 'cmd-leaderboard', 'command-lb'],
			group: 'util',
			memberName: 'command-leaderboard',
			description: 'Responds with the bot\'s most used commands.',
			guarded: true,
			args: [
				{
					key: 'page',
					prompt: 'What page do you want to view?',
					type: 'integer',
					min: 1,
					max: Math.ceil(this.client.registry.commands.size / 10)
				}
			]
		});
	}

	run(msg, { page }) {
		return msg.say(stripIndents`
			__**Command Usage Leaderboard (as of Last Restart):**__
			${this.makeLeaderboard(page).join('\n')}
		`);
	}

	makeLeaderboard(page) {
		let i = 0;
		let previousPts = null;
		let positionsMoved = 1;
		return this.client.registry.commands
			.filter(command => command.uses !== undefined)
			.sort((a, b) => b.uses - a.uses)
			.map(command => {
				if (previousPts === command.uses) {
					positionsMoved++;
				} else {
					i += positionsMoved;
					positionsMoved = 1;
				}
				previousPts = command.uses;
				return `**${i}.** ${command.name} (${command.uses} Use${command.uses === 1 ? '' : 's'})`;
			})
			.slice((page - 1) * 10, page * 10);
	}
};
