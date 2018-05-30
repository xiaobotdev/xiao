const Command = require('../../structures/Command');
const { oneLine } = require('common-tags');
const Random = require('random-js');
const genders = ['male', 'female'];
const { eyeColors, hairColors, hairStyles, extras } = require('../../assets/json/guess-looks');

module.exports = class GuessLooksCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'guess-looks',
			aliases: ['guess-my-looks'],
			group: 'analyze',
			memberName: 'guess-looks',
			description: 'Guesses what a user looks like.',
			args: [
				{
					key: 'user',
					prompt: 'Which user do you want me to guess the looks of?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	run(msg, { user }) {
		const authorUser = user.id === msg.author.id;
		const random = new Random(Random.engines.mt19937().seed(user.id));
		const gender = genders[random.integer(0, genders.length - 1)];
		const eyeColor = eyeColors[random.integer(0, eyeColors.length - 1)];
		const hairColor = hairColors[random.integer(0, hairColors.length - 1)];
		const hairStyle = hairStyles[random.integer(0, hairStyles.length - 1)];
		const age = random.integer(10, 100);
		const feet = random.integer(3, 7);
		const inches = random.integer(0, 11);
		const weight = random.integer(50, 300);
		const extra = extras[random.integer(0, extras.length - 1)];
		return msg.reply(oneLine`
			I think ${authorUser ? 'you are' : `${user.username} is`} a ${age} year old ${gender} with ${eyeColor} eyes
			and ${hairStyle} ${hairColor} hair. ${authorUser ? 'You are' : `${gender === 'male' ? 'He' : 'She'} is`}
			${feet}'${inches}" and weigh${authorUser ? '' : 's'} ${weight} pounds. Don't forget the ${extra}!
		`);
	}
};
