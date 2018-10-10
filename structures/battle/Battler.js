const { stripIndents } = require('common-tags');
const { list } = require('../../util/Util');
const choices = ['attack', 'defend', 'special', 'cure', 'run'];
const botChoices = ['attack', 'defend', 'special', 'cure'];

module.exports = class Battler {
	constructor(battle, user) {
		this.battle = battle;
		this.user = user;
		this.bot = user.bot;
		this.hp = 500;
		this.mp = 500;
		this.guard = false;
	}

	async chooseAction(msg) {
		if (this.bot) return botChoices[Math.floor(Math.random() * botChoices.length)];
		let content = stripIndents`
			${this}, do you ${list(choices.map(choice => `**${choice}**`), 'or')}? You have **${this.mp}** MP.
			**${this.battle.user.user.tag}:** ${this.battle.user.hp} HP
			**${this.battle.opponent.user.tag}:** ${this.battle.opponent.hp} HP
		`;
		if (this.battle.turn === 1 || this.battle.turn === 2) {
			content += '\n\n_Special uses 50 MP whether or not it hits. Cure uses all remaining MP, and heals that amount._';
		}
		await msg.say(content);
		const filter = res => {
			const choice = res.content.toLowerCase();
			if (res.author.id === this.user.id && choices.includes(choice)) {
				if ((choice === 'special' && this.mp < 50) || (choice === 'cure' && this.mp <= 0)) {
					msg.say('You don\'t have enough MP for that!').catch(() => null);
					return false;
				}
				return true;
			}
			return false;
		};
		const turn = await msg.channel.awaitMessages(filter, {
			max: 1,
			time: 30000
		});
		if (!turn.size) return 'failed:time';
		return turn.first().content.toLowerCase();
	}

	dealDamage(amount) {
		this.hp -= amount;
		return this.hp;
	}

	heal(amount) {
		this.hp += amount;
		return this.hp;
	}

	useMP(amount) {
		this.mp -= amount;
		return this.mp;
	}

	changeGuard() {
		this.guard = !this.guard;
		return this.guard;
	}

	forfeit() {
		this.hp = 0;
		return null;
	}

	toString() {
		return this.user.toString();
	}
};
