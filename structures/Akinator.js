const request = require('node-superfetch');
const cheerio = require('cheerio');
const regions = ['en', 'ar', 'cn', 'de', 'es', 'fr', 'il', 'it', 'jp', 'kr', 'nl', 'pt', 'ru', 'tr', 'id'];
const answers = ['Yes', 'No', 'Don\'t know', 'Probably', 'Probably not'];

class Akinator {
	constructor(region, childMode = false) {
		if (!regions.includes(region.toLowerCase())) throw new TypeError('Invalid region.');
		this.region = region.toLowerCase();
		this.childMode = Boolean(childMode);

		this.currentStep = 0;
		this.stepLastProposition = '';
		this.progress = '0.00000';
		this.answers = answers;
		this.question = null;
		this.session = null;
		this.signature = null;
		this.guessed = null;
		this.akiWin = null;
	}

	async start() {
		const { text } = await request
			.post(`https://${this.region}.akinator.com/game`)
			.send({
				sid: '1',
				cm: this.childMode
			});
		const $ = cheerio.load(text);
		this.question = $('.question-text').text();
		this.session = text.match(/session: '(.+)'/)[1];
		this.signature = text.match(/signature: '(.+)'/)[1];
		this.answers = [];
		$('.li-game').each((i, elem) => this.answers.push($(elem).text()));
		return this;
	}

	async step(answer) {
		const { body } = await request
			.post(`https://${this.region}.akinator.com/answer`)
			.send({
				step: this.currentStep.toString(),
				progression: this.progress,
				sid: '1',
				cm: this.childMode,
				answer,
				step_last_proposition: this.stepLastProposition,
				session: this.session,
				signature: this.signature
			});
		if (body.id_proposition) {
			this.guessed = {
				id: body.id_proposition,
				name: body.name_proposition,
				description: body.description_proposition,
				photo: body.photo
			};
			return this;
		}
		this.currentStep++;
		this.progress = body.progression;
		this.question = body.question;
		if (!this.question) this.akiWin = false;
		return this;
	}

	async back() {
		const { body } = await request
			.post(`https://${this.region}.akinator.com/cancel_answer`)
			.send({
				step: this.currentStep.toString(),
				progression: this.progress,
				sid: '1',
				cm: this.childMode,
				session: this.session,
				signature: this.signature
			});
		this.currentStep--;
		this.progress = body.progression;
		this.question = body.question;
		return this;
	}

	async guess(correct, keepGoing) {
		if (correct) {
			this.akiWin = true;
			return this;
		}
		if (!correct && keepGoing) {
			const params = new URLSearchParams();
			params.append('step', this.currentStep.toString());
			params.append('sid', '1');
			params.append('cm', this.childMode);
			params.append('progression', this.progress);
			params.append('session', this.session);
			params.append('signature', this.signature);
			params.append('forward_answer', '1');
			const { body, text } = await request
				.post(`https://${this.region}.akinator.com/exclude`)
				.send(params.toString(), true)
				.set({ 'Content-Type': 'application/x-www-form-urlencoded' });
			console.log(text);
			this.guessed = null;
			this.stepLastProposition = body.step;
			this.progress = body.progression;
			this.question = body.question;
			return this;
		}
		this.akiWin = false;
		return this;
	}
}

module.exports = { Akinator, regions };
