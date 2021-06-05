module.exports = class Group {
	constructor(client, id, name) {
		Object.defineProperty(this, 'client', { value: client });

		this.id = id.toLowerCase();
		this.name = name;
	}

	get commands() {
		return this.client.registry.commands.filter(command => command.groupID === this.id);
	}
};
