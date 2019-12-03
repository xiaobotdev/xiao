const Command = require('../../structures/Command');
const { oneLine } = require('common-tags');
const { MersenneTwister19937, integer } = require('random-js');
const genders = ['male', 'female'];
const { eyeColors, hairColors, hairStyles, extras } = require('../../assets/json/guess-looks');

module.exports = class GuessLooksCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'guess-looks',
			aliases: ['guess-my-looks'],
			group: 'seeded',
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
		if (user.id === this.client.user.id) return msg.reply('Me? Just look at my avatar, dummy.');
		const authorUser = user.id === msg.author.id;
		const random = MersenneTwister19937.seed(user.id);
		const gender = genders[integer(0, genders.length - 1)(random)];
		const eyeColor = eyeColors[integer(0, eyeColors.length - 1)(random)];
		const hairColor = hairColors[integer(0, hairColors.length - 1)(random)];
		const hairStyle = hairStyles[integer(0, hairStyles.length - 1)(random)];
		const age = integer(10, 100)(random);
		const feet = integer(3, 7)(random);
		const inches = integer(0, 11)(random);
		const weight = integer(50, 300)(random);
		const extra = extras[integer(0, extras.length - 1)(random)];
		return msg.reply(oneLine`
			I think ${authorUser ? 'you are' : `${user.username} is`} a ${age} year old ${gender} with ${eyeColor} eyes
			and ${hairStyle} ${hairColor} hair. ${authorUser ? 'You are' : `${gender === 'male' ? 'He' : 'She'} is`}
			${feet}'${inches}" and weigh${authorUser ? '' : 's'} ${weight} pounds. Don't forget the ${extra}!
		`);
	}
};
