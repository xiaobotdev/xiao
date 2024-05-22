const Command = require('../../framework/Command');
const { stripIndents } = require('common-tags');
const prizes = ['$0', '$2', '$4', '$10', '$500', '$1,000,000', 'the Jackpot'];

module.exports = class LotteryCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lottery',
			aliases: ['lotto'],
			group: 'games-sp',
			description: 'Attempt to win the lottery with 6 numbers.',
			args: [
				{
					key: 'choices',
					type: 'integer',
					infinite: true,
					max: 70,
					min: 1
				}
			]
		});
	}

	run(msg, { choices }) {
		const lotto = Array.from({ length: 6 }, () => Math.floor(Math.random() * 70) + 1);
		const similarities = lotto.filter((num, i) => choices[i] === num).length;
		return msg.reply(stripIndents`
			${lotto.join(', ')}
			You matched **${similarities}** numbers, which gives you **${prizes[similarities]}**! Congrats!
		`);
	}
};
