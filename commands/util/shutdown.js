const Command = require('../../structures/Command');
const { verify } = await require('../../util/Util');
const texts = require('../../assets/json/shutdown');

module.exports = class ShutdownCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'shutdown',
			aliases: ['die', 'restart', 'process.exit'],
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
		if (this.client.games.size > 0) {
			await msg.reply(`There are currently **${this.client.games.size}** games going on. Are you sure?`);
			const verification = await verify(msg.channel, msg.author);
			if (!verification) return msg.say('Aborted restart.');
		}
		if (this.client.phone.size > 0) {
			await msg.reply(`There are currently **${this.client.phone.size}** phone calls going on. Are you sure?`);
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
