const Command = require('../../framework/Command');
const { stripIndents } = require('common-tags');
const questions = require('../../assets/json/antidepressant-or-tolkien');
const answers = {
	drug: 'an Antidepressant',
	tolkien: 'a Tolkien character'
};
const tolkienResponses = ['tolkien', 't'];
const drugResponses = ['drug', 'antidepressant', 'anti-depressant', 'd', 'a', 'ad'];

module.exports = class AntidepressantOrTolkienCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'antidepressant-or-tolkien',
			aliases: [
				'antidepressant-tolkien',
				'drug-or-tolkien',
				'drug-tolkien',
				'tolkien-or-antidepressant',
				'tolkien-or-drug',
				'tolkien-antidepressant',
				'tolkien-drug',
				't-or-a',
				'a-or-t'
			],
			group: 'games-sp',
			description: 'See if you can guess if a word is an Antidepressant or Tolkien character.',
			game: true,
			credit: [
				{
					name: 'Antidepressants or Tolkien',
					url: 'https://antidepressantsortolkien.now.sh/',
					reason: 'Question Data'
				}
			]
		});
	}

	async run(msg) {
		const question = questions[Math.floor(Math.random() * questions.length)];
		await msg.reply(stripIndents`
			**You have 15 seconds, is this an Antidepressant or a Tolkien character?**
			${question.name}
		`);
		const filter = res => {
			if (res.author.id !== msg.author.id) return false;
			const choice = res.content.toLowerCase();
			if (drugResponses.includes(choice) || tolkienResponses.includes(choice)) return true;
			return false;
		};
		const msgs = await msg.channel.awaitMessages({
			filter,
			max: 1,
			time: 15000
		});
		if (!msgs.size) {
			return msg.reply(stripIndents`
				Time\'s up! It was **${answers[question.type]}**!
				_${question.text}_
			`);
		}
		const choice = msgs.first().content.toLowerCase();
		const correct = (question.type === 'tolkien' && tolkienResponses.includes(choice))
			|| (question.type === 'drug' && drugResponses.includes(choice));
		if (!correct) {
			return msg.reply(stripIndents`
				Oh no! It was **${answers[question.type]}**!
				_${question.text}_
			`);
		}
		return msg.reply(stripIndents`
			Correct! It was **${answers[question.type]}**!
			_${question.text}_
		`);
	}
};
