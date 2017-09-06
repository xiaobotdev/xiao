const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

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
					default: ''
				}
			]
		});

		this.fighting = new Set();
	}

	async run(msg, args) { // eslint-disable-line complexity
		const opponent = args.opponent || this.client.user;
		if (opponent.id === msg.author.id) return msg.say('You may not fight yourself.');
		if (this.fighting.has(msg.channel.id)) return msg.say('Only one fight may be occurring per channel.');
		this.fighting.add(msg.channel.id);
		try {
			if (!opponent.bot) {
				await msg.say(`${opponent}, do you accept this challenge?`);
				const verify = await msg.channel.awaitMessages(res => res.author.id === opponent.id, {
					max: 1,
					time: 30000
				});
				if (!verify.size || !['yes', 'y'].includes(verify.first().content.toLowerCase())) {
					this.fighting.delete(msg.channel.id);
					return msg.say('Looks like they declined...');
				}
			}
			let userHP = 500;
			let oppoHP = 500;
			let userTurn = false;
			let guard = false;
			const reset = (changeGuard = true) => {
				userTurn = !userTurn;
				if (changeGuard && guard) guard = false;
			};
			const dealDamage = damage => {
				if (userTurn) oppoHP -= damage;
				else userHP -= damage;
			};
			const forfeit = () => {
				if (userTurn) userHP = 0;
				else oppoHP = 0;
			};
			while (userHP > 0 && oppoHP > 0) { // eslint-disable-line no-unmodified-loop-condition
				const user = userTurn ? msg.author : opponent;
				let choice;
				if (!opponent.bot || (opponent.bot && userTurn)) {
					await msg.say(stripIndents`
						${user}, do you **fight**, **guard**, **special**, or **run**?
						**${msg.author.username}**: ${userHP}HP
						**${opponent.username}**: ${oppoHP}HP
					`);
					const turn = await msg.channel.awaitMessages(res => res.author.id === user.id, {
						max: 1,
						time: 30000
					});
					if (!turn.size) {
						await msg.say('Time!');
						forfeit();
						break;
					}
					choice = turn.first().content.toLowerCase();
				} else {
					const choices = ['fight', 'guard', 'special'];
					choice = choices[Math.floor(Math.random() * choices.length)];
				}
				if (choice === 'fight') {
					const damage = Math.floor(Math.random() * (guard ? 10 : 100)) + 1;
					await msg.say(`${user} deals **${damage}** damage!`);
					dealDamage(damage);
					reset();
				} else if (choice === 'guard') {
					await msg.say(`${user} guards!`);
					guard = true;
					reset(false);
				} else if (choice === 'special') {
					const hit = Math.floor(Math.random() * 4) + 1;
					if (hit === 1) {
						const damage = Math.floor(Math.random() * (((guard ? 300 : 150) - 100) + 1)) + 100;
						await msg.say(`${user} deals **${damage}** damage!`);
						dealDamage(damage);
						reset();
					} else {
						await msg.say(`${user}'s attack missed!`);
						reset();
					}
				} else if (choice === 'run') {
					await msg.say(`${user} flees!`);
					forfeit();
					break;
				} else {
					await msg.say(`${user}, I do not understand what you want to do.`);
				}
			}
			this.fighting.delete(msg.channel.id);
			return msg.say(stripIndents`
				The match is over!
				**Winner:** ${userHP > oppoHP ? `${msg.author} (${userHP}HP)` : `${opponent} (${oppoHP}HP)`}
				**Loser:** ${userHP > oppoHP ? `${opponent} (${oppoHP}HP)` : `${msg.author} (${userHP}HP)`}
			`);
		} catch (err) {
			this.fighting.delete(msg.channel.id);
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
