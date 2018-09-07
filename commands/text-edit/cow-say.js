const Command = require('../../structures/Command');
const cowsay = require('cowsay');
const cowList = require('cowsay/lib/cows');
const { list } = require('../../util/Util');
const cows = cowList.listSync();
cows.push('random');

module.exports = class CowSayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cow-say',
			group: 'text-edit',
			memberName: 'cow-say',
			description: 'Makes a cow say your text.',
			details: `**Types:** ${cows.join(', ')}`,
			args: [
				{
					key: 'text',
					prompt: 'What text would you like the cow to say?',
					type: 'string',
					max: 500
				},
				{
					key: 'type',
					prompt: `What type of cow would you like to use? Either ${list(cows, 'or')}.`,
					type: 'string',
					default: 'default',
					validate: type => {
						if (cows.includes(type.toLowerCase()) || type.toLowerCase() === 'cow') return true;
						return `Invalid type, please enter either ${list(cows, 'or')}.`;
					},
					parse: type => {
						if (type.toLowerCase() === 'cow') return 'default';
						return type.toLowerCase();
					}
				}
			]
		});
	}

	run(msg, { text, type }) {
		return msg.code(null, cowsay.say({
			text,
			f: type,
			r: type === 'random'
		}));
	}
};
