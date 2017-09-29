const { Command } = require('discord.js-commando');

module.exports = class ShutdownCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'shutdown',
			aliases: ['restart', 'power-off', 'die'],
			group: 'util',
			memberName: 'shutdown',
			description: 'Shuts down the current shard, or all shards.',
			guarded: true,
			args: [
				{
					key: 'all',
					prompt: 'Would you like to shutdown all shards?',
					type: 'boolean',
					default: false
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author) || `The \`${this.name}\` command can only be used by the bot owner.`;
	}

	async run(msg, { all }) {
		await msg.say(`Shutting down ${all ? 'all shards' : 'this shard'}...`);
		if (all) await this.client.shard.broadcastEval('process.exit(0)');
		else process.exit(0);
		return null;
	}
};
