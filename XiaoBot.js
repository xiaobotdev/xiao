const { TOKEN, OWNERS, COMMAND_PREFIX, INVITE } = process.env;
const path = require('path');
const Client = require('./structures/Client');
const client = new Client({
	commandPrefix: COMMAND_PREFIX,
	owner: OWNERS.split(','),
	invite: INVITE,
	disableEveryone: true,
	unknownCommandResponse: false,
	disabledEvents: ['TYPING_START'],
	messageCacheLifetime: 600,
	messageSweepInterval: 120
});
const SequelizeProvider = require('./providers/Sequelize');
const { dBots, dBotsOrg, filterTopics, parseTopic } = require('./structures/Util');

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['util', 'Utility'],
		['commands', 'Command Management'],
		['user-info', 'User Info'],
		['guild-info', 'Server Info'],
		['moderation', 'Moderation'],
		['random-res', 'Random Response'],
		['random-img', 'Random Image'],
		['image-edit', 'Image Manipulation'],
		['avatar-edit', 'Avatar Manipulation'],
		['text-edit', 'Text Manipulation'],
		['num-edit', 'Number Manipulation'],
		['search', 'Search'],
		['games', 'Games'],
		['random', 'Random/Other'],
		['roleplay', 'Roleplay']
	])
	.registerDefaultCommands({
		help: false,
		ping: false
	})
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.setProvider(new SequelizeProvider(client.database));

client.on('ready', () => {
	console.log(`[READY] Shard ${client.shard.id} logged in as ${client.user.tag} (${client.user.id})!`);
	client.user.setActivity(`${COMMAND_PREFIX}help | Shard ${client.shard.id}`, { type: 0 });
});

client.on('disconnect', event => {
	console.log(`[DISCONNECT] Shard ${client.shard.id} disconnected with code ${event.code}.`);
	process.exit(0);
});

client.on('error', console.error);

client.on('warn', console.warn);

client.on('commandError', (command, err) => console.error(command.name, err));

client.on('guildMemberAdd', member => {
	if (!member) return;
	const channel = filterTopics(member.guild.channels, 'memberlog').first();
	if (!channel) return;
	const msg = parseTopic(channel.topic, 'joinmessage')
		.replace(/{{member}}/gi, member.user.username)
		.replace(/{{server}}/gi, member.guild.name)
		.replace(/{{mention}}/gi, member);
	channel.send(msg || `Welcome ${member.user.username}!`);
});

client.on('guildMemberRemove', member => {
	if (!member) return;
	const channel = filterTopics(member.guild.channels, 'memberlog').first();
	if (!channel) return;
	const msg = parseTopic(channel.topic, 'leavemessage')
		.replace(/{{member}}/gi, member.user.username)
		.replace(/{{server}}/gi, member.guild.name)
		.replace(/{{mention}}/gi, member);
	channel.send(msg || `Bye ${member.user.username}...`);
});

client.on('guildCreate', async guild => {
	console.log(`[GUILD] I have joined ${guild.name}! (${guild.id})`);
	const guilds = await client.shard.fetchClientValues('guilds.size');
	const count = guilds.reduce((prev, val) => prev + val, 0);
	dBots(count, client.user.id);
	dBotsOrg(count, client.user.id);
});

client.on('guildDelete', async guild => {
	console.log(`[GUILD] I have left ${guild.name}... (${guild.id})`);
	const guilds = await client.shard.fetchClientValues('guilds.size');
	const count = guilds.reduce((prev, val) => prev + val, 0);
	dBots(count, client.user.id);
	dBotsOrg(count, client.user.id);
});

client.login(TOKEN);

process.on('unhandledRejection', console.error);
