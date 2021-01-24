const Command = require('../../structures/Command');

module.exports = class ChessDeleteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'chess-delete',
			aliases: ['delete-chess', 'chess-del', 'del-chess'],
			group: 'games-mp',
			memberName: 'chess-delete',
			description: 'Deletes your saved Chess game.'
		});
	}

	async run(msg) {
		const data = await this.client.redis.exists(`chess-${msg.author.id}`);
		if (!data) return msg.reply('You do not have a saved Chess game.');
		await this.client.redis.del(`chess-${msg.author.id}`);
		return msg.say('Your saved game has been deleted.');
	}
};
