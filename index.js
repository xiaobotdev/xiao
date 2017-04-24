const { CommandoClient } = require('discord.js-commando');
const { discordBots, carbon, webhook } = require('./poststats.js');
const path = require('path');
const client = new CommandoClient({
    commandPrefix: 'x;',
    owner: '242699360352206850',
    disableEveryone: true,
    invite: 'https://discord.gg/fqQF8mc'
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['userinfo', 'User Info'],
        ['guildinfo', 'Server Info'],
        ['moderation', 'Moderation'],
        ['response', 'Random Response'],
        ['randomimg', 'Random Image'],
        ['avataredit', 'Avatar Manipulation'],
        ['textedit', 'Text Manipulation'],
        ['imageedit', 'Image Manipulation'],
        ['search', 'Search'],
        ['games', 'Games'],
        ['random', 'Random/Other'],
        ['roleplay', 'Roleplay']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('guildCreate', async(guild) => {
    console.log(`[Guild] I have joined ${guild.name}! (Owned by ${guild.owner.user.tag}) (${guild.id})`);
    const guilds = await client.shard.fetchClientValues('guilds.size');
    const count = guilds.reduce((prev, val) => prev + val, 0);
    console.log(`[Count] ${count}`);
    webhook(`Joined ${guild.name}!\nOwned by: ${guild.owner.user.tag}\nID: ${guild.id}`, `Shard ${client.shard.id}`, 0x33CC33);
    try {
        const carbonStats = await carbon(count);
        console.log(`[Carbon] Successfully posted to Carbon. ${carbonStats}`);
    } catch (err) {
        console.log(`[Carbon] Failed to post to Carbon. ${err}`);
    }
    try {
        const dbStats = await discordBots(count, client.user.id);
        console.log(`[Discord Bots] Successfully posted to Discord Bots. ${dbStats}`);
    } catch (err) {
        console.log(`[Discord Bots] Failed to post to Discord Bots. ${err}`);
    }
});

client.on('guildDelete', async(guild) => {
    console.log(`[Guild] I have left ${guild.name}... (Owned by ${guild.owner.user.tag}) (${guild.id})`);
    const guilds = await client.shard.fetchClientValues('guilds.size');
    const count = guilds.reduce((prev, val) => prev + val, 0);
    console.log(`[Count] ${count}`);
    webhook(`Left ${guild.name}...\nOwned by: ${guild.owner.user.tag}\nID: ${guild.id}`, `Shard ${client.shard.id}`, 0xFF3300);
    try {
        const carbonStats = await carbon(count);
        console.log(`[Carbon] Successfully posted to Carbon. ${carbonStats}`);
    } catch (err) {
        console.log(`[Carbon] Failed to post to Carbon. ${err}`);
    }
    try {
        const dbStats = await discordBots(count, client.user.id);
        console.log(`[Discord Bots] Successfully posted to Discord Bots. ${dbStats}`);
    } catch (err) {
        console.log(`[Discord Bots] Failed to post to Discord Bots. ${err}`);
    }
});

client.on('disconnect', (event) => {
    console.log(`[Disconnect] Shard ${client.shard.id} disconnected with Code ${event.code}.`);
    webhook(`Disconnected with Code ${event.code}...`, `Shard ${client.shard.id}`, 0xFF3300);
});

client.setTimeout(() => {
    console.log(`[Restart] Shard ${client.shard.id} Restarted.`);
    process.exit(0);
}, 14400000);

client.on('ready', () => {
    console.log(`[Ready] Shard ${client.shard.id} Logged in!`);
    client.user.setGame(`x;help | Shard ${client.shard.id}`);
});

process.on('unhandledRejection', console.error);

client.login(process.env.TOKEN);
