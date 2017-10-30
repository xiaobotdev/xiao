const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const { randomRange } = require('../../util/Util');
const genders = ['male', 'female'];
const eyeColors = ['blue', 'brown', 'hazel', 'green', 'yellow'];
const hairColors = ['blonde', 'brown', 'red', 'black', 'grey', 'white'];
const hairStyles = ['curly', 'straight', 'wavy', 'long', 'shoulder-length', 'short', 'balding'];
const extras = ['freckles', 'glasses', 'dimples', 'contacts', 'loads of acne', 'pretty smile', 'braces'];

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
		const age = randomRange(10, 100);
		const feet = randomRange(3, 7);
		const inches = Math.floor(Math.random() * 12);
		const weight = randomRange(50, 300);
		const extra = extras[Math.floor(Math.random() * extras.length)];
		return msg.say(oneLine`
			I think ${user.username} is a ${age} year old ${gender} with ${eyeColor} eyes and ${hairStyle} ${hairColor}
			hair. They are ${feet}'${inches}" and weigh ${weight} pounds. Don't forget the ${extra}!
		`);
	}
};
