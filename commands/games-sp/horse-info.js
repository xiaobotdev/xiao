const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { formatTime } = require('../../util/Util');
const horses = require('../../assets/json/horse-race');

module.exports = class HorseInfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'horse-info',
			aliases: ['horse', 'race-horse'],
			group: 'games-sp',
			memberName: 'horse-info',
			description: 'Responds with detailed information on a horse.',
			args: [
				{
					key: 'horse',
					prompt: 'Which horse would you like to get information on?',
					type: 'string',
					validate: horse => {
						const valid = horses.filter(h => h.name.toLowerCase().includes(horse.toLowerCase()));
						if (valid.length > 1) return 'Multiple horses found. Please be more specific.';
						return Boolean(valid.length);
					},
					parse: horse => horses.find(h => h.name.toLowerCase().includes(horse.toLowerCase()))
				}
			]
		});
	}

	run(msg, { horse }) {
		return msg.say(stripIndents`
			__**Information on ${horse.name}**__
			**Name:** ${horse.name}
			**Fastest Recorded Time:** ${formatTime(horse.minTime)}
			**Name Origin:** ${horse.origin || 'None'}
		`);
	}
};
