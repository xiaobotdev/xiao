const Command = require('../../structures/Command');

module.exports = class MafiaRoleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'mafia-role',
			aliases: ['mafia-me'],
			group: 'mp-games',
			memberName: 'mafia-role',
			description: 'Displays your current role during Mafia games.'
		});
	}

	run(msg) {
		const games = this.client.games.filter(game => game.players.has(msg.author.id) && game.name === 'mafia');
		if (!games.size) return msg.reply('You aren\'t a member of any games.');
		return msg.reply(games.map(game => {
			const { role } = game.players.get(msg.author.id);
			return `**${game.channel.guild.name} (${game.channel}):** ${role}`;
		}).join('\n'));
	}
};
