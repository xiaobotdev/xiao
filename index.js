const commando = require('discord.js-commando');
const request = require('superagent');
const config = require('./config.json');
const client = new commando.Client({
    commandPrefix: ';',
    unknownCommandResponse: false,
    owner: config.owner
});
const Cleverbot = require('cleverbot-node');
const cleverbot = new Cleverbot;
cleverbot.configure({
    botapi: config.clevkey
});
const clevusers = require('./clevusers.json');
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

client.on('message', (message) => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
    if (message.content.startsWith(`<@${client.user.id}>`)) {
        if (message.guild.id === config.server || message.guild.id === config.personalServer || message.author.id === config.owner) {
            if (message.author.id === clevusers.allowed[message.author.id]) {
                let cleverMessage = message.content.split(" ").slice(1).join(" ");
                console.log(`[Cleverbot] ${cleverMessage}`);
                message.channel.startTyping();
                cleverbot.write(cleverMessage, function(response) {
                    message.reply(response.output);
                    message.channel.stopTyping();
                });
            }
        }
    }
});

client.on('guildMemberAdd', (member) => {
    if (member.guild.id !== config.server) return;
    member.addRole(member.guild.roles.find('name', 'Members'));
    let addedMemberName = member.user.username;
    return member.guild.channels.get(config.announcementChannel).send(`Welcome ${addedMemberName}!`);
});

client.on('guildMemberRemove', (member) => {
    if (member.guild.id !== config.server) return;
    let removedMemberName = member.user.username;
    return member.guild.channels.get(config.announcementChannel).send(`Bye ${removedMemberName}...`);
});

client.on('guildCreate', (guild) => {
    console.log(`[Guild] I have joined the guild: ${guild.name}, Owned by: ${guild.owner.user.username} (${guild.id})!`);
    client.guilds.get(config.server).channels.get(config.announcementChannel).send(`I have joined the server: ${guild.name}, Owned by: ${guild.owner.user.username} (${guild.id})!`);
    client.shard.fetchClientValues('guilds.size').then(results => {
        console.log(`[Guild Count] ${results.reduce((prev, val) => prev + val, 0)}`);
        request
            .post('https://www.carbonitex.net/discord/data/botdata.php')
            .send({
                key: config.carbonkey,
                servercount: results.reduce((prev, val) => prev + val, 0)
            })
            .then(function(parsedBody) {
                console.log('[Carbon] Successfully posted to Carbon.');
            }).catch(function(err) {
                console.log(`[Carbon] Failed to post to Carbon. ${err}`);
            });
        request
            .post(`https://bots.discord.pw/api/bots/${config.botID}/stats`)
            .set({
                'Authorization': config.botskey
            })
            .send({
                server_count: results.reduce((prev, val) => prev + val, 0)
            })
            .then(function(parsedBody) {
                console.log('[Discord Bots] Successfully posted to Discord Bots.');
            }).catch(function(err) {
                console.log(`[Discord Bots] Failed to post to Discord Bots. ${err}`);
            });
    });
});

client.on('guildDelete', (guild) => {
    console.log(`[Guild] I have left the guild: ${guild.name}, Owned by: ${guild.owner.user.username} (${guild.id})...`);
    client.guilds.get(config.server).channels.get(config.announcementChannel).send(`I have left the server: ${guild.name}, Owned by: ${guild.owner.user.username} (${guild.id})...`);
    client.shard.fetchClientValues('guilds.size').then(results => {
        console.log(`[Guild Count] ${results.reduce((prev, val) => prev + val, 0)}`);
        request
            .post('https://www.carbonitex.net/discord/data/botdata.php')
            .send({
                key: config.carbonkey,
                servercount: results.reduce((prev, val) => prev + val, 0)
            })
            .then(function(parsedBody) {
                console.log('[Carbon] Successfully posted to Carbon.');
            }).catch(function(err) {
                console.log(`[Carbon] Failed to post to Carbon. ${err}`);
            });
        request
            .post(`https://bots.discord.pw/api/bots/${config.botID}/stats`)
            .set({
                'Authorization': config.botskey
            })
            .send({
                server_count: results.reduce((prev, val) => prev + val, 0)
            })
            .then(function(parsedBody) {
                console.log('[Discord Bots] Successfully posted to Discord Bots.');
            }).catch(function(err) {
                console.log(`[Discord Bots] Failed to post to Discord Bots. ${err}`);
            });
    });
});

client.on('disconnect', () => {
    process.exit(0);
});

client.once('ready', () => {
    console.log('[Ready] Logged in!');
    client.user.setGame(";help | dragonfire535");
});

process.on('unhandledRejection', function(reason, p) {
    console.log(`[Error] A Possibly Unhandled Rejection has Occurred. ${reason}`);
});

client.login(config.token);
