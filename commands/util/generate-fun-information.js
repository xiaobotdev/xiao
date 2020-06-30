const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { formatNumber } = require('../../util/Util');

module.exports = class GenerateFunInformationCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'generate-fun-information',
			aliases: ['gen-fun-information', 'generate-fun-info', 'gen-fun-info', 'generate-fun', 'gen-fun'],
			group: 'util',
			memberName: 'generate-fun-information',
			description: 'Generates the "Fun Information" for Xiao\'s README.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			guarded: true
		});
	}

	async run(msg) {
		const cloc = await this.client.registry.commands.get('cloc').cloc();
		const text = stripIndents`
			- ${formatNumber(Math.floor(this.client.registry.commands.size / 100) * 100)}+ commands
			- ${formatNumber(Math.floor(cloc.JavaScript.code / 1000) * 1000)}+ lines of JavaScript
			- ${formatNumber(Math.floor(cloc.JSON.code / 1000) * 1000)}+ lines of JSON data
			- ${new Date().getFullYear() - 2017} years of development
		`;
		await msg.direct({ files: [{ attachment: Buffer.from(text), name: 'fun-information.txt' }] });
		return msg.say('📬 Sent `fun-information.txt` to your DMs!');
	}
};
