const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const moment = require('moment');

module.exports = class LastRunLeaderboardCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'last-run-leaderboard',
			aliases: ['last-run-lb', 'lr-leaderboard', 'lr-lb'],
			group: 'util-public',
			memberName: 'last-run-leaderboard',
			description: 'Responds with the bot\'s most recently run commands.',
			guarded: true,
			args: [
				{
					key: 'page',
					prompt: 'What page do you want to view?',
					type: 'integer',
					default: 1,
					min: 1
				}
			]
		});
	}

	run(msg, { page }) {
		const commands = this.filterCommands(
			this.client.registry.commands,
			this.client.isOwner(msg.author),
			msg.channel.nsfw
		);
		const totalPages = Math.ceil(commands.size / 10);
		if (page > totalPages) return msg.say(`Page ${page} does not exist (yet).`);
		return msg.say(stripIndents`
			__**Command Last Run Leaderboard (Page ${page}/${totalPages}):**__
			${this.makeLeaderboard(commands, page).join('\n')}

			_Current Time: ${moment.utc().format('MM/DD/YYYY h:mm A')}_
		`);
	}

	makeLeaderboard(commands, page) {
		let i = 0;
		let previousPts = null;
		let positionsMoved = 1;
		return commands
			.sort((a, b) => a.lastRun ? b.lastRun - a.lastRun : 1)
			.map(command => {
				if (previousPts === command.lastRun || (command.lastRun && previousPts === command.lastRun.toISOString())) {
					positionsMoved++;
				} else {
					i += positionsMoved;
					positionsMoved = 1;
				}
				previousPts = command.lastRun ? command.lastRun.toISOString() : null;
				const displayTime = command.lastRun ? moment.utc(command.lastRun).format('MM/DD/YYYY h:mm A') : null;
				return `**${i}.** ${command.name} (${displayTime || 'Never'})`;
			})
			.slice((page - 1) * 10, page * 10);
	}

	filterCommands(commands, owner, nsfw) {
		return commands.filter(command => {
			if (command.lastRun === undefined || command.unknown) return false;
			if (!owner && command.hidden) return false;
			if (!owner && command.ownerOnly) return false;
			if (!owner && command.nsfw && !nsfw) return false;
			return true;
		});
	}
};
