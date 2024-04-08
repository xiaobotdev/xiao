module.exports = class SlashCommand {
	constructor(client, options) {
		Object.defineProperty(this, 'client', { value: client });

		this.name = options.name.toLowerCase();
		this.description = options.description;
		this.credit = options.credit || [];
		this.credit.push({
			name: 'Dragon Fire',
			url: 'https://github.com/dragonfire535',
			reason: 'Code'
		});
	}
};
