const { stripIndents } = require('common-tags');
const questions = {
	mafia: 'Who would you like to kill?',
	detective: 'Who do you think is a Mafia member?'
};

module.exports = class Player {
	constructor(game, user, role) {
		this.game = game;
		this.user = user;
		this.id = user.id;
		this.role = role;
	}

	toString() {
		return this.user.toString();
	}

	async dmRound() {
		const valid = Array.from(this.game.players.filter(p => p.role !== this.role).values());
		await this.user.send(stripIndents`
			${questions[this.role]} Please type the number.
			${valid.map((p, i) => `**${i + 1}.** ${p.user.tag}`).join('\n')}
		`);
		const filter = res => valid[Number.parseInt(res.content, 10) - 1];
		const decision = await this.user.dmChannel.awaitMessages(filter, {
			max: 1,
			time: 120000
		});
		if (!decision.size) {
			await this.user.send('Sorry, time is up!');
			return null;
		}
		const choice = valid[Number.parseInt(decision.first().content, 10) - 1].id;
		if (this.role === 'detective') {
			const isMafia = this.game.players.get(choice).role === 'mafia';
			await this.user.send(isMafia ? 'Yes, they are a Mafioso.' : 'No, they are not a Mafioso.');
		} else {
			await this.user.send(`**${this.game.players.get(choice).user.tag}** is your choice...`);
		}
		return choice;
	}
};
