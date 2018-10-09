const Battler = require('./Battler');

module.exports = class Battle {
	constructor(user, opponent) {
		this.user = new Battler(this, user);
		this.opponent = new Battler(this, opponent);
		this.userTurn = false;
	}

	get attacker() {
		return this.userTurn ? this.user : this.opponent;
	}

	get defender() {
		return this.userTurn ? this.opponent : this.user;
	}

	reset(changeGuard = true) {
		if (changeGuard && this.user.guarding) this.user.changeGuard();
		if (changeGuard && this.opponent.guarding) this.opponent.changeGuard();
		this.userTurn = !this.userTurn;
		return null;
	}

	get winner() {
		if (this.user.hp <= 0) return this.opponent;
		if (this.opponent.hp <= 0) return this.user;
		return null;
	}
};
