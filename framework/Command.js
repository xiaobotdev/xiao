const Argument = require('./Argument');

module.exports = class Command {
	constructor(client, options) {
		Object.defineProperty(this, 'client', { value: client });

		this.name = options.name.toLowerCase();
		this.aliases = options.aliases ? options.aliases.map(alias => alias.toLowerCase()) : [];
		this.groupID = options.group.toLowerCase();
		this.memberName = options.memberName.toLowerCase();
		this.description = options.description;
		this.details = options.details || null;
		this.flags = options.flags || [];
		this.args = options.args ? options.args.map(arg => new Argument(client, arg)) : [];
		this.clientPermissions = options.clientPermissions || [];
		this.userPermissions = options.userPermissions || [];
		this.ownerOnly = options.ownerOnly || false;
		this.nsfw = options.nsfw || false;
		this.guildOnly = options.guildOnly || false;
		this.patronOnly = options.patronOnly || false;
		this.guarded = options.guarded || false;
		this.unknown = options.unknown || false;
		this.throttling = options.throttling || { usages: 2, duration: 5 };
		this.credit = options.credit || [];
		this.credit.push({
			name: 'Dragon Fire',
			url: 'https://github.com/dragonfire535',
			reason: 'Code'
		});
		this.uses = 0;
		this.lastRun = null;
		this.throttles = new Map();
		this._timeouts = new Map();
		this._enabled = true;
	}

	get group() {
		return this.client.registry.groups.get(this.groupID);
	}

	usage() {
		const args = this.args
			.map(arg => `${arg.default ? '[' : '<'}${arg.label || arg.key}${arg.default ? ']' : '>'}`).join(' ');
		return `\`${this.client.commandPrefix}${this.name} ${args}\` or \`@${this.client.user.tag} ${this.name} ${args}\``;
	}

	disable() {
		this._enabled = false;
	}

	enable() {
		this._enabled = true;
	}

	reload() {
		delete require.cache[require.resolve(`../commands/${this.groupID}/${this.memberName}.js`)];
		const NewCmd = require(`../commands/${this.groupID}/${this.memberName}.js`);
		this.client.registry.commands.delete(this.name);
		this.client.registry.registerCommand(new NewCmd(this.client));
	}
};
