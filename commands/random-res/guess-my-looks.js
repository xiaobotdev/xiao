const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const genders = ['male', 'female'];
const eyeColors = ['blue', 'brown', 'hazel', 'green'];
const hairColors = ['blonde', 'brown', 'red', 'black'];
const hairStyles = ['curly', 'straight', 'wavy', 'long', 'shoulder-length', 'short', 'balding'];
const extras = ['freckles', 'glasses', 'dimples', 'contacts', 'loads of acne', 'pretty smile'];

module.exports = class GuessMyLooksCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'guess-my-looks',
			aliases: ['guess-looks'],
			group: 'random-res',
			memberName: 'guess-my-looks',
			description: 'Guesses what you look like.',
			args: [
				{
					key: 'user',
					prompt: 'Which user do you want me to guess the looks of?',
					type: 'user',
					default: ''
				}
			]
		});
	}

	run(msg, { user }) {
		if (!user) user = msg.author;
		const gender = genders[Math.floor(Math.random() * genders.length)];
		const eyeColor = eyeColors[Math.floor(Math.random() * eyeColors.length)];
		const hairColor = hairColors[Math.floor(Math.random() * hairColors.length)];
		const hairStyle = hairStyles[Math.floor(Math.random() * hairStyles.length)];
		const age = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
		const feet = Math.floor(Math.random() * (7 - 3 + 1)) + 3;
		const inches = Math.floor(Math.random() * 12);
		const weight = Math.floor(Math.random() * (300 - 50 + 1)) + 50;
		const extra = extras[Math.floor(Math.random() * extras.length)];
		const prefix = user.id === msg.author.id ? 'You' : 'They';
		return msg.reply(oneLine`
			${prefix} are, I think, a ${age} year old ${gender} with ${eyeColor} eyes and ${hairStyle}
			${hairColor} hair. ${prefix} are ${feet}'${inches}" and weigh ${weight} pounds. Don't forget the ${extra}!
		`);
	}
};
