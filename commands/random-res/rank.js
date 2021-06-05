const Command = require('../../framework/Command');
const { shuffle } = require('../../util/Util');

module.exports = class RankCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rank',
			group: 'random-res',
			memberName: 'rank',
			description: 'Ranks the options you provide.',
			args: [
				{
					key: 'choices',
					prompt: 'What choices do you want me rank?',
					type: 'string',
					infinite: true,
					max: 150
				}
			]
		});
	}

	run(msg, { choices }) {
		return msg.say(shuffle(choices).map((choice, i) => `**${i + 1}.** ${choice}`).slice(0, 10).join('\n'));
	}
};
