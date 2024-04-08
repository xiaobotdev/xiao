module.exports = class SlashCommand {
	constructor(client, options) {
		Object.defineProperty(this, 'client', { value: client });

		this.name = options.name.toLowerCase();
		this.description = options.description;
		this.nsfw = options.nsfw || false;
		this.guildOnly = options.guildOnly || false;
		this.credit = options.credit || [];
		this.credit.push({
			name: 'Dragon Fire',
			url: 'https://github.com/dragonfire535',
			reason: 'Code'
		});
		this.uses = 0;
		this.lastRun = null;
	}
};
