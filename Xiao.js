require('dotenv').config();
const { XIAO_TOKEN, OWNERS, XIAO_PREFIX, INVITE } = process.env;
const { mkdir } = require('fs/promises');
const path = require('path');
const { GatewayIntentBits, Partials, AllowedMentionsTypes, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const Client = require('./structures/Client');
const client = new Client({
	commandPrefix: XIAO_PREFIX,
	mentionPrefix: true,
	owner: OWNERS.split(','),
	invite: INVITE,
	allowedMentions: {
		parse: [AllowedMentionsTypes.User],
		repliedUser: true
	},
	partials: [Partials.GuildMember, Partials.Channel],
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessageTyping,
		GatewayIntentBits.MessageContent
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

	// Interval to change activity every minute
	setInterval(() => {
		const activity = client.activities[Math.floor(Math.random() * client.activities.length)];
		const text = typeof activity.text === 'function' ? activity.text(client) : activity.text;
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
	try {
		const disabled = await client.redis.hgetall('disabled');
		for (const command of Object.keys(disabled)) {
			client.registry.commands.get(command).disable();
			client.logger.info(`[DISABLED] Disabled the ${command} command.`);
		}
	} catch (err) {
		client.logger.error(`[DISABLED] Error while disabling commands:\n${err.stack}`);
	}

	// Check for API keys and disable commands that need them if not present
	if (!process.env.REDIS_HOST || !process.env.REDIS_PASS) {
		client.logger.error('[REDIS] No REDIS_HOST or REDIS_PASS in env. Exiting process.');
		process.exit(1);
	}
	if (!process.env.BITLY_KEY) {
		client.registry.commands.get('shorten-url').disable();
		client.logger.info('[DISABLED] No BITLY_KEY in env. shorten-url has been disabled.');
	}
	if (!process.env.CLEVERBOT_KEY) {
		client.registry.commands.get('cleverbot').disable();
		client.registry.commands.get('cleverbot-end').disable();
		client.logger.info('[DISABLED] No CLEVERBOT_KEY in env. cleverbot and cleverbot-end have been disabled.');
	}
	if (!process.env.GITHUB_ACCESS_TOKEN) {
		client.registry.commands.get('github').disable();
		client.registry.commands.get('changelog').disable();
		client.logger.info('[DISABLED] No GITHUB_ACCESS_TOKEN in env. github and changelog have been disabled.');
	}
	if (!process.env.GOV_KEY) {
		client.registry.commands.get('apod').disable();
		client.logger.info('[DISABLED] No GOV_KEY in env. apod has been disabled.');
	}
	if (!process.env.SPOTIFY_KEY || !process.env.SPOTIFY_SECRET) {
		client.registry.commands.get('guess-song').disable();
		client.logger.info('[DISABLED] No SPOTIFY_KEY or SPOTIFY_SECRET in env. guess-song has been disabled.');
	}
	if (!process.env.THECATAPI_KEY) {
		client.registry.commands.get('cat').disable();
		client.logger.info('[DISABLED] No THECATAPI_KEY in env. cat has been disabled.');
	}
	if (!process.env.THEDOGAPI_KEY) {
		client.registry.commands.get('dog').disable();
		client.logger.info('[DISABLED] No THEDOGAPI_KEY in env. dog has been disabled.');
	}
	if (!process.env.WEBSTER_KEY) {
		client.registry.commands.get('word-of-the-day').disable();
		client.registry.commands.get('word-chain').disable();
		client.registry.commands.get('define').disable();
		client.logger.info('[DISABLED] No WEBSTER_KEY in env. word-of-the-day, word-chain, and define have been disabled.');
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
	if (guildsLeft > 0) client.logger.info(`[BLACKLIST] Left ${guildsLeft} guilds owned by blacklisted users.`);

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

	// Fetch adult site list
	try {
		await client.fetchAdultSiteList();
		client.logger.info('[ADULT SITES] Fetched adult site list.');
	} catch (err) {
		client.logger.error(`[ADULT SITES] Failed to fetch list\n${err.stack}`);
	}

	// Fetch NSFW model
	try {
		await client.tensorflow.loadNSFWModel();
		client.logger.info('[NSFW MODEL] Loaded NSFW model.');
	} catch (err) {
		client.logger.error(`[NSFW MODEL] Failed to load NSFW model\n${err.stack}`);
	}

	// Set up face detection
	try {
		await client.tensorflow.loadFaceDetector();
		client.logger.info('[FACE DETECTOR] Loaded face detector.');
	} catch (err) {
		client.logger.error(`[FACE DETECTOR] Failed to load face detector\n${err.stack}`);
	}

	// Fetch all members
	try {
		for (const guild of client.guilds.cache.values()) {
			await guild.members.fetch();
		}
		client.logger.info('[MEMBERS] Fetched all guild members.');
	} catch (err) {
		client.logger.error(`[MEMBERS] Failed to fetch guild members\n${err.stack}`);
	}
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
	try {
		await guild.members.fetch();
		client.logger.info('[MEMBERS] Fetched all guild members for new server.');
	} catch (err) {
		client.logger.error(`[MEMBERS] Failed to fetch guild members for new server\n${err.stack}`);
	}
	if (guild.systemChannel && guild.systemChannel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages)) {
		try {
			const usage = client.registry.commands.get('help').usage('');
			await guild.systemChannel.send(`Hi! I'm Xiao, use ${usage} to see my commands, yes?`);
		} catch {
			// Nothing!
		}
	}
	const joinLeaveChannel = await client.fetchJoinLeaveChannel();
	if (joinLeaveChannel) {
		const owner = await guild.fetchOwner();
		const embed = new EmbedBuilder()
			.setColor(0x7CFC00)
			.setThumbnail(guild.iconURL({ extension: 'png' }))
			.setTitle(`Joined ${guild.name}!`)
			.setFooter({ text: `ID: ${guild.id}` })
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
		const embed = new EmbedBuilder()
			.setColor(0xFF0000)
			.setThumbnail(guild.iconURL({ extension: 'png' }))
			.setTitle(`Left ${guild.name}...`)
			.setFooter({ text: `ID: ${guild.id}` })
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

client.on('commandRun', command => {
	if (command.unknown) return;
	client.logger.info(`[COMMAND] ${command.name} was used.`);
});

client.on('commandError', (command, err) => client.logger.error(`[COMMAND:${command.name}]\n${err.stack}`));

client.login(XIAO_TOKEN);
