const Command = require('../../structures/Command');
const path = require('path');
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
				usages: 1,
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
		const connection = this.client.voice.connections.get(msg.guild.id);
		if (!connection) {
			const usage = this.client.registry.commands.get('join').usage();
			return msg.reply(`I am not in a voice channel. Use ${usage} to fix that!`);
		}
		try {
			let age;
			for (const [dataAge, file] of Object.entries(data)) {
				connection.play(path.join(__dirname, '..', '..', 'assets', 'sounds', 'hearing-test', file));
				await delay(2000);
				await msg.reply('Did you hear that sound? Reply with [y]es or [n]o.');
				const heard = await verify(msg.channel, msg.author);
				if (!heard) {
					age = dataAge.replace(/a|b|c|d/, '');
					break;
				}
			}
			if (age === 'all') return msg.reply('Everyone should be able to hear that. You cannot hear.');
			return msg.reply(`You have the hearing of a **${Number.parseInt(age, 10) + 1} year old**.`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
