const Command = require('../../structures/Command');
const { shuffle } = require('../../util/Util');
const waldos = require('../../assets/json/waldo');

module.exports = class WaldoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'waldo',
			aliases: ['wheres-waldo', 'where\'s-waldo'],
			group: 'games-sp',
			memberName: 'waldo',
			description: 'Try to find Waldo with spoiler tags!',
			credit: [
				{
					name: 'u/guschuma',
					url: 'https://www.reddit.com/user/guschuma/',
					reason: 'Concept',
					reasonURL: 'https://www.reddit.com/r/copypasta/comments/gkk7z1/wheres_waldo_game_created_by_me/'
				},
				{
					name: 'Martin Handford',
					url: 'https://www.candlewick.com/authill.asp?b=Author&m=bio&id=1497&pix=y',
					reason: 'Original "Where\'s Wally?" Book Series'
				}
			]
		});
	}

	run(msg) {
		const where = shuffle(waldos);
		return msg.say(where.map(waldo => `||${waldo}||`).join(' '));
	}
};
