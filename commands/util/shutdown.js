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
		const timers = this.client.registry.commands.get('timer').timers.size;
		if (games > 0 || calls > 0 || timers > 0) {
			let currentString = '';
			if (games > 0) {
				currentString += `${games} games`;
				if ((calls > 0 && timers < 1) || (calls < 1 && timers > 0)) currentString += ' and ';
				else if (calls > 0 && timers > 0) currentString += ', ';
			}
			if (calls > 0) {
				currentString += `${calls} phone calls`;
				if (games < 1 && timers > 0) currentString += ' and ';
				if (timers > 0) currentString += ', and';
			}
			if (timers > 0) currentString += `${timers} timers`;
			await msg.reply(`There are currently ${currentString}. Are you sure?`);
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
