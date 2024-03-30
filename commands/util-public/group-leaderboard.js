const Command = require('../../framework/Command');
const { stripIndents } = require('common-tags');
const { formatNumber } = require('../../util/Util');

module.exports = class GroupLeaderboardCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'group-leaderboard',
			aliases: ['grp-lb', 'grp-leaderboard', 'group-lb'],
			group: 'util-public',
			memberName: 'group-leaderboard',
			description: 'Responds with the bot\'s most used command groups.',
			guarded: true,
			args: [
				{
					key: 'page',
					type: 'integer',
					default: 1,
					min: 1
				}
			]
		});
	}

	run(msg, { page }) {
		const groups = this.client.registry.groups.map(group => {
			const uses = group.commands.reduce((a, b) => {
				if (b.unknown || !b.uses) return a;
				return a + b.uses;
			}, 0);
			return { uses, group };
		});
		const totalPages = Math.ceil(this.client.registry.groups.size / 10);
		if (page > totalPages) return msg.say(`Page ${page} does not exist (yet).`);
		return msg.say(stripIndents`
			__**Command Group Usage Leaderboard (Page ${page}/${totalPages}):**__
			${this.makeLeaderboard(groups, page).join('\n')}
		`);
	}

	makeLeaderboard(groups, page) {
		let i = 0;
		let previousPts = null;
		let positionsMoved = 1;
		return groups
			.sort((a, b) => b.uses - a.uses)
			.map(group => {
				if (previousPts === group.uses) {
					positionsMoved++;
				} else {
					i += positionsMoved;
					positionsMoved = 1;
				}
				previousPts = group.uses;
				return `**${i}.** ${group.group.name} (${formatNumber(group.uses)} Use${group.uses === 1 ? '' : 's'})`;
			})
			.slice((page - 1) * 10, page * 10);
	}
};
