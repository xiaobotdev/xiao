const commando = require('discord.js-commando');
const request = require('superagent');
const config = require('./config.json');
const client = new commando.Client({
    commandPrefix: ';',
    unknownCommandResponse: false,
    owner: config.owner,
    disableEveryone: true
});
const path = require('path');

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['botinfo', 'Bot Info'],
        ['userinfo', 'User Info'],
        ['guildinfo', 'Server Info'],
        ['moderation', 'Moderation'],
        ['response', 'Random Response'],
        ['avataredit', 'Avatar Manipulation'],
        ['textedit', 'Text Manipulation'],
        ['numedit', 'Number Manipulation'],
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
    client.guilds.get(config.server).channels.get(config.announcementChannel).send(`I have joined the server: ${guild.name}, Owned by: ${guild.owner.user.username} (${guild.id})!`);
    const results = await client.shard.fetchClientValues('guilds.size');
    console.log(`[Guild Count] ${results.reduce((prev, val) => prev + val, 0)}`);
    try {
        const response = await request
            .post('https://www.carbonitex.net/discord/data/botdata.php')
            .send({
                key: config.carbonkey,
                servercount: results.reduce((prev, val) => prev + val, 0)
            });
        console.log(`[Carbon] Successfully posted to Carbon. ${response.text}`);
    }
    catch (err) {
        console.log(`[Carbon] Failed to post to Carbon. ${err}`);
    }
    try {
        const response = await request
            .post(`https://bots.discord.pw/api/bots/${config.botID}/stats`)
            .set({
                'Authorization': config.botskey
            })
            .send({
                server_count: results.reduce((prev, val) => prev + val, 0)
            });
        console.log(`[Discord Bots] Successfully posted to Discord Bots. ${response.body.stats[0].server_count}`);
    }
    catch (err) {
        console.log(`[Discord Bots] Failed to post to Discord Bots. ${err}`);
    }
});

client.on('guildDelete', async(guild) => {
    console.log(`[Guild] I have left the guild: ${guild.name}, Owned by: ${guild.owner.user.username} (${guild.id})...`);
    client.guilds.get(config.server).channels.get(config.announcementChannel).send(`I have left the server: ${guild.name}, Owned by: ${guild.owner.user.username} (${guild.id})...`);
    const results = await client.shard.fetchClientValues('guilds.size');
    console.log(`[Guild Count] ${results.reduce((prev, val) => prev + val, 0)}`);
    try {
        const response = await request
            .post('https://www.carbonitex.net/discord/data/botdata.php')
            .send({
                key: config.carbonkey,
                servercount: results.reduce((prev, val) => prev + val, 0)
            });
        console.log(`[Carbon] Successfully posted to Carbon. ${response.text}`);
    }
    catch (err) {
        console.log(`[Carbon] Failed to post to Carbon. ${err}`);
    }
    try {
        const response = await request
            .post(`https://bots.discord.pw/api/bots/${config.botID}/stats`)
            .set({
                'Authorization': config.botskey
            })
            .send({
                server_count: results.reduce((prev, val) => prev + val, 0)
            });
        console.log(`[Discord Bots] Successfully posted to Discord Bots. ${response.body.stats[0].server_count}`);
    }
    catch (err) {
        console.log(`[Discord Bots] Failed to post to Discord Bots. ${err}`);
    }
});

client.on('disconnect', () => {
    process.exit(0);
});

client.once('ready', () => {
    console.log('[Ready] Logged in!');
    client.user.setGame(';help | dragonfire535');
});

process.on('unhandledRejection', console.error);

client.login(config.token);
