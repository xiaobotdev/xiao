require('dotenv').config();
const { XIAO_TOKEN, OWNERS, XIAO_PREFIX, INVITE } = process.env;
const { mkdir } = require('fs/promises');
const path = require('path');
const { Intents, MessageEmbed } = require('discord.js');
const Client = require('./structures/Client');
const client = new Client({
	commandPrefix: XIAO_PREFIX,
	mentionPrefix: true,
	owner: OWNERS.split(','),
	invite: INVITE,
	allowedMentions: {
		parse: ['users'],
		repliedUser: true
	},
	partials: ['GUILD_MEMBER', 'CHANNEL'],
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_MESSAGE_TYPING,
		Intents.FLAGS.GUILD_WEBHOOKS,
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
		Intents.FLAGS.DIRECT_MESSAGE_TYPING
	]
});
const { formatNumber, checkFileExists } = require('./util/Util');

client.registry
	.registerDefaultTypes()
	.registerTypesIn(path.join(__dirname, 'types'))
	.registerGroups([
		['util', 'Utility (Owner)'],
		['util-public', 'Utility'],
		['util-voice', 'Utility (Voice)'],
		['info', 'Discord Information'],
		['random-res', 'Random Response'],
		['random-img', 'Random Image'],
		['random-seed', 'Seeded Randomizers'],
		['single', 'Single Response'],
		['auto', 'Automatic Response'],
		['events', 'Events'],
		['search', 'Search'],
		['pokedex', 'Pokédex'],
		['analyze', 'Analyzers'],
		['code', 'Programming'],
		['games-sp', 'Single-Player Games'],
		['games-mp', 'Multi-Player Games'],
		['edit-face', 'Face Manipulation'],
		['edit-image', 'Image Manipulation'],
		['edit-image-text', 'Image Text Manipulation'],
		['edit-avatar', 'Avatar Manipulation'],
		['edit-meme', 'Meme Generators'],
		['edit-text', 'Text Manipulation'],
		['edit-number', 'Number Manipulation'],
		['voice', 'Play Audio'],
		['remind', 'Reminders'],
		['phone', 'Phone'],
		['cleverbot', 'Cleverbot'],
		['other', 'Other']
	])
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', async () => {
	client.logger.info(`[READY] Logged in as ${client.user.tag}! ID: ${client.user.id}`);

	// Make temp directories
	const tmpFolderExists = await checkFileExists(path.join(__dirname, 'tmp'));
	if (!tmpFolderExists) await mkdir(path.join(__dirname, 'tmp'));
	const decTalkFolderExists = await checkFileExists(path.join(__dirname, 'tmp', 'dec-talk'));
	if (!decTalkFolderExists) await mkdir(path.join(__dirname, 'tmp', 'dec-talk'));

	// Push client-related activities
	client.activities.push(
		{ text: () => `${formatNumber(client.guilds.cache.size)} servers`, type: 'WATCHING' },
		{ text: () => `with ${formatNumber(client.registry.commands.size)} commands`, type: 'PLAYING' },
		{ text: () => `${formatNumber(client.channels.cache.size)} channels`, type: 'WATCHING' }
	);

	// Interval to change activity every minute
	setInterval(() => {
		const activity = client.activities[Math.floor(Math.random() * client.activities.length)];
		const text = typeof activity.text === 'function' ? activity.text() : activity.text;
		client.user.setActivity(text, { type: activity.type });
	}, 60000);

	// Import command-leaderboard.json
	try {
		const results = client.importCommandLeaderboard();
		if (results) {
			client.logger.info('[LEADERBOARD] command-leaderboard.json successfully loaded.');
		} else {
			client.logger.error('[LEADERBOARD] command-leaderboard.json is not formatted correctly.');
		}
	} catch (err) {
		client.logger.error(`[LEADERBOARD] Could not parse command-leaderboard.json:\n${err.stack}`);
	}

	// Set up disabled commands
	const disabled = await this.client.redis.hgetall('disabled');
	for (const command of Object.keys(disabled)) {
		client.registry.commands.get(command).disable();
		client.logger.info(`[DISABLED] Disabled the ${command} command.`);
	}

	// Import command-last-run.json
	try {
		const results = client.importLastRun();
		if (results) {
			client.logger.info('[LASTRUN] command-last-run.json successfully loaded.');
		} else {
			client.logger.error('[LASTRUN] command-last-run.json is not formatted correctly.');
		}
	} catch (err) {
		client.logger.error(`[LASTRUN] Could not parse command-last-run.json:\n${err.stack}`);
	}

	// Export command-leaderboard.json and command-last-run.json every 30 minutes
	setInterval(() => {
		try {
			client.exportCommandLeaderboard();
			client.logger.info('[LEADERBOARD] command-leaderboard.json successfully exported.');
		} catch (err) {
			client.logger.error(`[LEADERBOARD] Failed to export command-leaderboard.json:\n${err.stack}`);
		}
		try {
			client.exportLastRun();
			client.logger.info('[LASTRUN] command-last-run.json successfully exported.');
		} catch (err) {
			client.logger.error(`[LASTRUN] Failed to export command-last-run.json:\n${err.stack}`);
		}
	}, 1.8e+6);

	// Import blacklist
	try {
		const results = client.importBlacklist();
		if (results) {
			client.logger.info('[BLACKLIST] blacklist.json successfully loaded.');
		} else {
			client.logger.error('[BLACKLIST] blacklist.json is not formatted correctly.');
		}
	} catch (err) {
		client.logger.error(`[BLACKLIST] Could not parse blacklist.json:\n${err.stack}`);
	}

	// Make sure bot is not in any blacklisted guilds
	for (const id of client.blacklist.guild) {
		try {
			const guild = await client.guilds.fetch(id, false);
			await guild.leave();
			client.logger.info(`[BLACKLIST] Left blacklisted guild ${id}.`);
		} catch {
			if (!client.guilds.cache.has(id)) continue;
			client.logger.info(`[BLACKLIST] Failed to leave blacklisted guild ${id}.`);
		}
	}

	// Make sure bot is not in any guilds owned by a blacklisted user
	let guildsLeft = 0;
	for (const guild of client.guilds.cache.values()) {
		if (client.blacklist.user.includes(guild.ownerID)) {
			try {
				await guild.leave();
				guildsLeft++;
			} catch {
				client.logger.info(`[BLACKLIST] Failed to leave blacklisted guild ${guild.id}.`);
			}
		}
	}
	client.logger.info(`[BLACKLIST] Left ${guildsLeft} guilds owned by blacklisted users.`);

	// Set up existing timers
	try {
		await client.timers.fetchAll();
		client.logger.info('[TIMERS] All timers imported.');
	} catch (err) {
		client.logger.error(`[TIMERS] Failed to import timers\n${err.stack}`);
	}

	// Register all canvas fonts
	try {
		await client.registerFontsIn(path.join(__dirname, 'assets', 'fonts'));
		client.logger.info('[FONTS] All fonts loaded.');
	} catch (err) {
		client.logger.error(`[FONTS] Failed to load fonts\n${err.stack}`);
	}

	// Set up moment timezones
	try {
		client.setTimezones();
		client.logger.info('[TIMEZONES] Set all custom timezones.');
	} catch (err) {
		client.logger.error(`[TIMEZONES] Failed to set timezones\n${err.stack}`);
	}

	// Set up parse-domain
	await client.loadParseDomain();
	client.logger.info('[PARSE DOMAIN] parse-domain loaded.');

	// Fetch adult site list
	try {
		await client.fetchAdultSiteList();
		client.logger.info('[ADULT SITES] Fetched adult site list.');
	} catch (err) {
		client.logger.error(`[ADULT SITES] Failed to fetch list\n${err.stack}`);
	}

	// Fetch NSFW model
	try {
		await client.loadNSFWModel();
		client.logger.info('[NSFW MODEL] Loaded NSFW model.');
	} catch (err) {
		client.logger.error(`[NSFW MODEL] Failed to load NSFW model\n${err.stack}`);
	}

	// Set up face detection
	await client.loadFaceDetector();
	client.logger.info('[FACE DETECTOR] Loaded face detector.');

	// Fetch all members
	for (const [id, guild] of client.guilds.cache) { // eslint-disable-line no-unused-vars
		await guild.members.fetch();
	}
	client.logger.info('[MEMBERS] Fetched all guild members.');
});

client.on('messageCreate', async msg => {
	const hasText = Boolean(msg.content);
	const hasImage = msg.attachments.size !== 0;
	const hasEmbed = msg.embeds.length !== 0;
	if (msg.author.bot || (!hasText && !hasImage && !hasEmbed)) return;
	if (client.blacklist.user.includes(msg.author.id)) return;
	if (client.dispatcher.isCommand(msg)) return;
	if (client.games.has(msg.channel.id)) return;

	// Cleverbot handler
	const cleverbot = client.cleverbots.get(msg.channel.id);
	if (cleverbot) {
		if (!cleverbot.shouldRespond(msg)) return;
		client.registry.commands.get('cleverbot').uses++;
		msg.channel.sendTyping().catch(() => null);
		try {
			const response = await cleverbot.respond(msg.cleanContent);
			await msg.channel.send(response);
			return;
		} catch (err) {
			if (err.status === 503) {
				await msg.channel.send('Monthly API limit reached. Ending conversation.');
				client.cleverbots.delete(msg.channel.id);
				return;
			}
			await msg.channel.send('Sorry, blacked out there for a second. Come again?');
			return;
		}
	}

	// Phone message handler
	const origin = client.phone.find(call => call.origin.id === msg.channel.id);
	const recipient = client.phone.find(call => call.recipient.id === msg.channel.id);
	if (!origin && !recipient) return;
	const call = origin || recipient;
	if (call.originDM && call.startUser.id !== msg.author.id) return;
	if (msg.guild && (!msg.channel.topic || !msg.channel.topic.includes('<xiao:phone>'))) return;
	if (!call.active) return;
	try {
		await call.send(origin ? call.recipient : call.origin, msg, hasText, hasImage, hasEmbed);
	} catch {
		return; // eslint-disable-line no-useless-return
	}
});

client.on('guildCreate', async guild => {
	if (client.blacklist.guild.includes(guild.id) || client.blacklist.user.includes(guild.ownerID)) {
		try {
			await guild.leave();
			return;
		} catch {
			return;
		}
	}
	if (guild.systemChannel && guild.systemChannel.permissionsFor(client.user).has('SEND_MESSAGES')) {
		try {
			const usage = client.registry.commands.get('help').usage();
			await guild.systemChannel.send(`Hi! I'm Xiao, use ${usage} to see my commands, yes?`);
		} catch {
			// Nothing!
		}
	}
	const joinLeaveChannel = await client.fetchJoinLeaveChannel();
	if (joinLeaveChannel) {
		const owner = await guild.fetchOwner();
		const embed = new MessageEmbed()
			.setColor(0x7CFC00)
			.setThumbnail(guild.iconURL({ format: 'png' }))
			.setTitle(`Joined ${guild.name}!`)
			.setFooter(`ID: ${guild.id}`)
			.setTimestamp()
			.addField('❯ Members', formatNumber(guild.memberCount))
			.addField('❯ Owner', owner.user.tag);
		await joinLeaveChannel.send({ embeds: [embed] });
	}
});

client.on('guildDelete', async guild => {
	const joinLeaveChannel = await client.fetchJoinLeaveChannel();
	if (joinLeaveChannel) {
		const owner = client.users.cache.get(guild.ownerID);
		const embed = new MessageEmbed()
			.setColor(0xFF0000)
			.setThumbnail(guild.iconURL({ format: 'png' }))
			.setTitle(`Left ${guild.name}...`)
			.setFooter(`ID: ${guild.id}`)
			.setTimestamp()
			.addField('❯ Members', formatNumber(guild.memberCount))
			.addField('❯ Owner', owner ? owner.tag : guild.ownerID);
		await joinLeaveChannel.send({ embeds: [embed] });
	}
});

client.on('disconnect', event => {
	client.logger.error(`[DISCONNECT] Disconnected with code ${event.code}.`);
	client.exportCommandLeaderboard();
	client.exportLastRun();
	process.exit(0);
});

client.on('error', err => client.logger.error(err.stack));

client.on('warn', warn => client.logger.warn(warn));

client.on('commandRun', async command => {
	if (command.unknown) return;
	client.logger.info(`[COMMAND] ${command.name} was used.`);
	if (command.ownerOnly) return;
	const channel = await client.fetchCommandChannel();
	if (!channel) return;
	channel.send(`\`${command.name}\` was used! It has now been used **${formatNumber(command.uses)}** times!`)
		.catch(() => null);
});

client.on('commandError', (command, err) => client.logger.error(`[COMMAND:${command.name}]\n${err.stack}`));

client.login(XIAO_TOKEN);
