const Command = require('../../structures/Command');
const { verify, list } = require('../../util/Util');
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
		const blocks = [];
		if (this.client.games.size > 0) blocks.push(`${this.client.games.size} game(s)`);
		if (this.client.phone.size > 0) blocks.push(`${this.client.phone.size} phone call(s)`);
		if (this.client.dispatchers.size > 0) blocks.push(`${this.client.dispatchers.size} voice command(s)`);
		if (this.client.cleverbots.size > 0) blocks.push(`${this.client.cleverbots.size} Cleverbot(s)`);
		if (blocks.length) {
			await msg.reply(`There are currently **${list(blocks)}**. Are you sure?`);
			const verification = await verify(msg.channel, msg.author);
			if (!verification) return msg.reply('Aborted restart.');
		}
		try {
			this.uses++;
			this.lastRun = new Date();
			this.client.exportCommandLeaderboard();
			this.client.exportLastRun();
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
