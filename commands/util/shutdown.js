const Command = require('../../structures/Command');

module.exports = class ShutdownCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'shutdown',
			aliases: ['restart', 'power-off'],
			group: 'util',
			memberName: 'shutdown',
			description: 'Shuts down the current shard, or all shards.',
			guarded: true,
			ownerOnly: true,
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

	async run(msg, { all }) {
		await msg.say(`Shutting down ${all ? 'all shards' : 'this shard'}...`);
		if (all) await this.client.shard.broadcastEval('process.exit(0)');
		else process.exit(0);
		return null;
	}
};
