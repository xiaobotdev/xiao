const Command = require('../../structures/Command');
const { verify } = require('../../util/Util');
const texts = require('../../assets/json/shutdown');

module.exports = class ShutdownCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'shutdown',
			aliases: ['die', 'restart', 'process.exit', 'reboot'],
			group: 'util',
			memberName: 'shutdown',
			description: 'Shuts down the bot.',
			details: 'Only the bot owner(s) may use this command.',
			guarded: true,
			ownerOnly: true,
			args: [
				{
					key: 'code',
					prompt: 'What code do you want to send to `process.exit`?',
					type: 'integer',
					default: 0
				}
			]
		});
	}

	async run(msg, { code }) {
		const games = this.client.games.size;
		const calls = this.client.phone.size;
		let areIs = 'are';
		if (games > 0 || calls > 0) {
			let currentString = '';
			if (games > 0) {
				currentString += `${games} game${games > 1 ? 's' : ''}`;
				if (calls > 0) currentString += ' and ';
				if (games === 1 && (calls > 0 ? calls === 1 : true)) areIs = 'is';
			}
			if (calls > 0) {
				currentString += `${calls} phone call${calls > 1 ? 's' : ''}`;
				if (calls === 1 && (games > 0 ? games === 1 : true)) areIs = 'is';
			}
			await msg.reply(`There ${areIs} currently **${currentString}**. Are you sure?`);
			const verification = await verify(msg.channel, msg.author);
			if (!verification) return msg.say('Aborted restart.');
		}
		try {
			this.uses++;
			this.client.exportCommandLeaderboard();
			this.client.logger.info('[SHUTDOWN] Manual shutdown engaged.');
			const text = texts[Math.floor(Math.random() * texts.length)];
			await msg.say(text);
			process.exit(code);
			return null;
		} catch {
			process.exit(code);
			return null;
		}
	}
};
