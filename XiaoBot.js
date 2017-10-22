const { TOKEN, OWNERS, COMMAND_PREFIX, INVITE } = process.env;
const path = require('path');
const { CommandoClient } = require('discord.js-commando');
const client = new CommandoClient({
	commandPrefix: COMMAND_PREFIX,
	owner: OWNERS.split(','),
	invite: INVITE,
	disableEveryone: true,
	unknownCommandResponse: false,
	disabledEvents: ['TYPING_START']
});
const whitelist = require('./assets/json/whitelist');

client.registry
	.registerDefaultTypes()
	.registerTypesIn(path.join(__dirname, 'types'))
	.registerGroups([
		['util', 'Utility'],
		['guild-info', 'Server Information'],
		['moderation', 'Moderation'],
		['random-res', 'Random Response'],
		['single-res', 'Single Response'],
		['image-edit', 'Image Manipulation'],
		['avatar-edit', 'Avatar Manipulation'],
		['text-edit', 'Text Manipulation'],
		['num-edit', 'Number Manipulation'],
		['search', 'Search'],
		['games', 'Games'],
		['other', 'Other'],
		['roleplay', 'Roleplay']
	])
	.registerDefaultCommands({
		help: false,
		ping: false,
		prefix: false,
		commandState: false
	})
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', () => {
	console.log(`[READY] Shard ${client.shard.id} logged in as ${client.user.tag}! (${client.user.id})`);
	client.setInterval(() => {
		const activities = [
			`${COMMAND_PREFIX}help for commands`,
			'with dragonfire535',
			client.options.invite,
			`with ${client.registry.commands.size} commands`,
			'Rune Factory 4'
		];
		client.user.setActivity(activities[Math.floor(Math.random() * activities.length)]);
	}, 60000);
	for (const guild of client.guilds.values()) {
		if (whitelist.includes(guild.id)) continue;
		console.log(`[LEAVE] Leaving guild ${guild.name}.`);
		guild.leave().catch(err => console.error(`[LEAVE] Failed to leave ${guild.name}.`, err));
	}
});

client.on('disconnect', event => {
	console.error(`[DISCONNECT] Shard ${client.shard.id} disconnected with code ${event.code}.`);
	process.exit(0);
});

client.on('error', err => console.error('[ERROR]', err));

client.on('warn', err => console.warn('[WARNING]', err));

client.on('commandError', (command, err) => console.error('[COMMAND ERROR]', command.name, err));

client.dispatcher.addInhibitor(msg => {
	if (msg.channel.type !== 'text' || !msg.channel.topic) return false;
	if (msg.channel.topic.includes('<blocked>')) return 'topic blocked';
	return false;
});

client.login(TOKEN);

process.on('unhandledRejection', err => {
	console.error('[FATAL] Unhandled Promise Rejection.', err);
	process.exit(1);
});
