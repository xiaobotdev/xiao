const { stripIndents } = require('common-tags');
const { list } = require('../../util/Util');
const choices = ['fight', 'guard', 'special', 'run'];
const botChoices = ['fight', 'guard', 'special'];

module.exports = class Battler {
	constructor(battle, user) {
		this.battle = battle;
		this.user = user;
		this.bot = user.bot;
		this.hp = 500;
		this.guarding = false;
	}

	async chooseAction(msg) {
		if (this.bot) return botChoices[Math.floor(Math.random() * botChoices.length)];
		await msg.say(stripIndents`
			${this}, do you ${list(choices.map(choice => `**${choice}**`), 'or')}?
			**${this.battle.user.user.tag}:** ${this.battle.user.hp} HP
			**${this.battle.opponent.user.tag}:** ${this.battle.opponent.hp} HP
		`);
		const filter = res => res.author.id === this.user.id && choices.includes(res.content.toLowerCase());
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

	changeGuard() {
		this.guarding = !this.guarding;
		return this.guarding;
	}

	forfeit() {
		this.hp = 0;
		return null;
	}

	toString() {
		return this.user.toString();
	}
};
