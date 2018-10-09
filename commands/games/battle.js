const Command = require('../../structures/Command');
const Battle = require('../../structures/battle/Battle');
const { randomRange, verify } = require('../../util/Util');

module.exports = class BattleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'battle',
			aliases: ['fight', 'death-battle'],
			group: 'games',
			memberName: 'battle',
			description: 'Engage in a turn-based battle against another user or the AI.',
			args: [
				{
					key: 'opponent',
					prompt: 'What user would you like to battle?',
					type: 'user',
					default: () => this.client.user
				}
			]
		});

		this.battles = new Map();
	}

	async run(msg, { opponent }) {
		if (opponent.id === msg.author.id) return msg.reply('You may not fight yourself.');
		if (this.battles.has(msg.channel.id)) return msg.reply('Only one fight may be occurring per channel.');
		this.battles.set(msg.channel.id, new Battle(msg.author, opponent));
		const battle = this.battles.get(msg.channel.id);
		try {
			if (!opponent.bot) {
				await msg.say(`${opponent}, do you accept this challenge?`);
				const verification = await verify(msg.channel, opponent);
				if (!verification) {
					this.fighting.delete(msg.channel.id);
					return msg.say('Looks like they declined...');
				}
			}
			while (!battle.winner) {
				const choice = await battle.attacker.chooseAction(msg);
				if (choice === 'fight') {
					const damage = Math.floor(Math.random() * (battle.defender.guarding ? 5 : 50)) + 1;
					await msg.say(`${battle.attacker} deals **${damage}** damage!`);
					battle.defender.dealDamage(damage);
					battle.reset();
				} else if (choice === 'guard') {
					await msg.say(`${battle.attacker} guards!`);
					battle.attacker.changeGuard();
					battle.reset(false);
				} else if (choice === 'special') {
					const miss = Math.floor(Math.random() * 3);
					if (miss) {
						await msg.say(`${battle.attacker}'s attack missed!`);
					} else {
						const damage = randomRange(battle.defender.guarding ? 50 : 100, battle.defender.guarding ? 100 : 200);
						await msg.say(`${battle.attacker} deals **${damage}** damage!`);
						battle.defender.dealDamage(damage);
					}
					battle.reset();
				} else if (choice === 'run') {
					await msg.say(`${battle.attacker} flees!`);
					battle.attacker.forfeit();
				} else if (choice === 'failed:time') {
					await msg.say(`Time's up, ${battle.attacker}!`);
					battle.reset();
				} else {
					await msg.say('I do not understand what you want to do.');
				}
			}
			const { winner } = battle;
			this.battles.delete(msg.channel.id);
			return msg.say(`The match is over! Congrats, ${winner}!`);
		} catch (err) {
			this.battles.delete(msg.channel.id);
			throw err;
		}
	}
};
