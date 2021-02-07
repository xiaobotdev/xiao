const Command = require('../../structures/Command');

module.exports = class ChessSetUpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'chess-set-up',
			aliases: ['set-up-chess', 'chess-create', 'create-chess'],
			group: 'games-mp',
			memberName: 'chess-set-up',
			description: 'Sets up and saves a custom Chess game.',
			args: [
				{
					key: 'fen',
					prompt: 'What FEN would you like to use for the game?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { fen }) {
		const data = await this.client.redis.exists(`chess-${msg.author.id}`);
		if (data) return msg.reply('You already have a saved Chess game.');
		await this.client.redis.set(`chess-${msg.author.id}`, JSON.stringify({
			fen,
			whiteTime: -1,
			blackTime: -1,
			color: 'white',
			fiftyRuleMove: 0
		}));
		const usage = this.client.registry.commands.get('chess').usage();
		return msg.say(`Your custom game has been saved. You can use it using ${usage}.`);
	}
};
