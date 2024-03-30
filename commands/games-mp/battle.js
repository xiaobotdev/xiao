const Command = require('../../framework/Command');
const Battle = require('../../structures/battle/Battle');
const { randomRange, verify } = require('../../util/Util');

module.exports = class BattleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'battle',
			aliases: ['fight', 'death-battle', 'rpg-battle'],
			group: 'games-mp',
			memberName: 'battle',
			description: 'Engage in a turn-based battle against another user or the AI.',
			game: true,
			args: [
				{
					key: 'opponent',
					type: 'user'
				}
			]
		});
	}

	async run(msg, { opponent }) {
		if (opponent.id === msg.author.id) return msg.reply('You may not battle yourself.');
		if (this.client.blacklist.user.includes(opponent.id)) return msg.reply('This user is blacklisted.');
		const battle = new Battle(msg.author, opponent);
		if (!opponent.bot) {
			await msg.say(`${opponent}, do you accept this challenge?`);
			const verification = await verify(msg.channel, opponent);
			if (!verification) return msg.say('Looks like they declined...');
		}
		while (!battle.winner) {
			const choice = await battle.attacker.chooseAction(msg);
			if (choice === 'attack') {
				const damage = randomRange(battle.defender.guard ? 5 : 20, battle.defender.guard ? 20 : 50);
				await msg.say(`${battle.attacker} deals **${damage}** damage!`);
				battle.defender.dealDamage(damage);
				battle.reset();
			} else if (choice === 'defend') {
				await msg.say(`${battle.attacker} defends!`);
				battle.attacker.changeGuard();
				battle.reset(false);
			} else if (choice === 'special') {
				const miss = Math.floor(Math.random() * 5);
				if (miss === 0 || miss === 3) {
					await msg.say(`${battle.attacker}'s special attack missed!`);
				} else if (miss === 1 || miss === 5) {
					const damage = randomRange(battle.defender.guard ? 10 : 40, battle.defender.guard ? 40 : 100);
					await msg.say(`${battle.attacker}'s special attack grazed the opponent, dealing **${damage}** damage!`);
					battle.defender.dealDamage(damage);
				} else if (miss === 2) {
					const damage = randomRange(battle.defender.guard ? 20 : 80, battle.defender.guard ? 80 : 200);
					await msg.say(`${battle.attacker}'s special attack hit directly, dealing **${damage}** damage!`);
					battle.defender.dealDamage(damage);
				}
				battle.attacker.useMP(25);
				battle.reset();
			} else if (choice === 'cure') {
				const amount = Math.round(battle.attacker.mp / 2);
				await msg.say(`${battle.attacker} heals **${amount}** HP!`);
				battle.attacker.heal(amount);
				battle.attacker.useMP(battle.attacker.mp);
				battle.reset();
			} else if (choice === 'final') {
				await msg.say(`${battle.attacker} uses their final move, dealing **100** damage!`);
				battle.defender.dealDamage(100);
				battle.attacker.useMP(50);
				battle.attacker.usedFinal = true;
				battle.reset();
			} else if (choice === 'run') {
				await msg.say(`${battle.attacker} flees!`);
				battle.attacker.forfeit();
			} else if (choice === 'failed:time') {
				await msg.say(`Time's up, ${battle.attacker}!`);
				battle.reset();
				if (battle.lastTurnTimeout) {
					battle.endedDueToInactivity = true;
					break;
				} else {
					battle.lastTurnTimeout = true;
				}
			} else {
				await msg.say('I do not understand what you want to do.');
			}
			if (choice !== 'failed:time' && battle.lastTurnTimeout) battle.lastTurnTimeout = false;
		}
		if (battle.winner === 'time') return msg.say('Game ended due to inactivity.');
		return msg.say(`The match is over! Congrats, ${battle.winner}!`);
	}
};
