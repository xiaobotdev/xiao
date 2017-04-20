const { CommandoClient } = require('discord.js-commando');
const request = require('superagent');
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
    .registerDefaultCommands({
        prefix: false
    })
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('guildCreate', async(guild) => {
    console.log(`[Guild] I have joined the guild: ${guild.name}, Owned by: ${guild.owner.user.username} (${guild.id})!`);
    const guilds = await client.shard.fetchClientValues('guilds.size');
    const count = guilds.reduce((prev, val) => prev + val, 0);
    console.log(`[Count] ${count}`);
    try {
        const response = await request
            .post('https://www.carbonitex.net/discord/data/botdata.php')
            .send({
                key: process.env.CARBON_KEY,
                servercount: count
            });
        console.log(`[Carbon] Successfully posted to Carbon. ${response.text}`);
    } catch (err) {
        console.log(`[Carbon] Failed to post to Carbon. ${err}`);
    }
    try {
        const response = await request
            .post(`https://bots.discord.pw/api/bots/${client.user.id}/stats`)
            .set({
                'Authorization': process.env.DISCORD_BOTS_KEY
            })
            .send({
                server_count: count
            });
        console.log(`[Discord Bots] Successfully posted to Discord Bots. ${response.body.stats[0].server_count}`);
    } catch (err) {
        console.log(`[Discord Bots] Failed to post to Discord Bots. ${err}`);
    }
});

client.on('guildDelete', async(guild) => {
    console.log(`[Guild] I have left the guild: ${guild.name}, Owned by: ${guild.owner.user.username} (${guild.id})...`);
    const guilds = await client.shard.fetchClientValues('guilds.size');
    const count = guilds.reduce((prev, val) => prev + val, 0);
    console.log(`[Count] ${count}`);
    try {
        const response = await request
            .post('https://www.carbonitex.net/discord/data/botdata.php')
            .send({
                key: process.env.CARBON_KEY,
                servercount: count
            });
        console.log(`[Carbon] Successfully posted to Carbon. ${response.text}`);
    } catch (err) {
        console.log(`[Carbon] Failed to post to Carbon. ${err}`);
    }
    try {
        const response = await request
            .post(`https://bots.discord.pw/api/bots/${client.user.id}/stats`)
            .set({
                'Authorization': process.env.DISCORD_BOTS_KEY
            })
            .send({
                server_count: count
            });
        console.log(`[Discord Bots] Successfully posted to Discord Bots. ${response.body.stats[0].server_count}`);
    } catch (err) {
        console.log(`[Discord Bots] Failed to post to Discord Bots. ${err}`);
    }
});

client.on('disconnect', (event) => {
    console.log(`[Disconnect] The Shard ${client.shard.id} disconnected with Code ${event.code}.`);
    process.exit(0);
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
