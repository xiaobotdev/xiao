const Command = require('../../framework/Command');
const path = require('path');
const { stripIndents } = require('common-tags');
const { delay, verify } = require('../../util/Util');
const data = require('../../assets/json/hearing-test');

module.exports = class HearingTestCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hearing-test',
			aliases: ['hear-test', 'hear', 'hearing'],
			group: 'games-sp',
			memberName: 'hearing-test',
			description: 'Test your hearing.',
			throttling: {
				usages: 2,
				duration: 10
			},
			guildOnly: true,
			userPermissions: ['CONNECT', 'SPEAK'],
			credit: [
				{
					name: 'Noise addicts',
					url: 'http://www.noiseaddicts.com/',
					reason: 'Sounds',
					reasonURL: 'http://www.noiseaddicts.com/2011/06/mosquito-ringtones/'
				}
			]
		});
	}

	async run(msg) {
		const connection = this.client.dispatchers.get(msg.guild.id);
		if (!connection) {
			const usage = this.client.registry.commands.get('join').usage();
			return msg.reply(`I am not in a voice channel. Use ${usage} to fix that!`);
		}
		if (!connection.canPlay) return msg.reply('I am already playing audio in this server.');
		try {
			let age;
			let range;
			let previousAge = 'all';
			let previousRange = 8;
			for (const { age: dataAge, khz, file } of data) {
				connection.play(path.join(__dirname, '..', '..', 'assets', 'sounds', 'hearing-test', file));
				await delay(3500);
				await msg.reply('Did you hear that sound? Reply with **[y]es** or **[n]o**.');
				const heard = await verify(msg.channel, msg.author);
				if (!heard || file === data[data.length - 1].file) {
					age = previousAge;
					range = previousRange;
					break;
				}
				previousAge = dataAge;
				previousRange = khz;
			}
			if (age === 'all') return msg.reply('Everyone should be able to hear that. You cannot hear.');
			if (age === 'max') {
				return msg.reply(stripIndents`
					You can hear any frequency of which a human is capable.
					The maximum frequency you were able to hear was **${range}000hz**.
				`);
			}
			return msg.reply(stripIndents`
				You have the hearing of someone **${Number.parseInt(age, 10) + 1} or older**.
				The maximum frequency you were able to hear was **${range}000hz**.
			`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
