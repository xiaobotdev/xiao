const Discord = require('discord.js');
const commando = require('discord.js-commando');
const config = require('./config.json');
const request = require('superagent');
const clevusers = require('./clevusers.json');
const client = new commando.Client({
    commandPrefix: ';',
    unknownCommandResponse: false,
    owner: config.owner
});
const Cleverbot = require('cleverbot-node');
const cleverbot = new Cleverbot;
cleverbot.configure({botapi: config.clevkey});
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
    ['random', 'Random/Other'],
    ['roleplay', 'Roleplay']
])
.registerDefaultGroups()
.registerDefaultCommands({
    prefix: false
})
.registerCommandsIn(path.join(__dirname, 'commands'));

client.on('message', (message) => {
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;
    if(message.content.includes("(╯°□°）╯︵ ┻━┻")) {
        if(message.guild.id === "110373943822540800") return;
        console.log("[Command] " + message.content);
        message.channel.send("Calm down!   ┬─┬ ノ( ゜-゜ノ)");
    }
    if (message.content.startsWith("<@" + client.user.id + ">")){
        if(message.guild.id === config.server || message.author.id === config.owner || message.guild.id === config.personalServer) {
            console.log("[Cleverbot] " + message.content);
            if(message.author.id === clevusers.allowed[message.author.id] || message.guild.id === config.personalServer) {
                let cleverMessage = message.content.replace("<@" + client.user.id + ">", "");
                message.channel.startTyping();
                cleverbot.write(cleverMessage, function (response) {
                    message.reply(response.output);
                    message.channel.stopTyping();
                });
            } else {
                message.channel.send(":x: Error! You are either not verified for Cleverbot, or banned from it. Please check <#274669940852785152> for a link to the forum to sign-up for Cleverbot.");
            }
        }
    }
});

client.on('guildMemberAdd', member => {
    if(member.guild.id !== config.server) return;
    member.addRole(member.guild.roles.find('name', 'Members'));
    let username = member.user.username;
    member.guild.defaultChannel.send('Welcome ' + username + '!');
});

client.on('guildMemberRemove', member => {
    if(member.guild.id !== config.server) return;
    let username = member.user.username;
    member.guild.defaultChannel.send('Bye ' + username + '...');
});

client.on('guildCreate', guild => {
    console.log("[Guild] I have joined the guild: " + guild.name + ", " + guild.owner.user.username + " (" + guild.id + ")!");
    client.guilds.get(config.server).channels.get(config.announcementChannel).send("I have joined the guild: " + guild.name + " (Owner: " + guild.owner.user.username + ")!");
    client.shard.fetchClientValues('guilds.size').then(results => {
        console.log("[Guild Count] " + results.reduce((prev, val) => prev + val, 0));
        request
        .post('https://www.carbonitex.net/discord/data/botdata.php')
        .send({ key: config.carbonkey, servercount: results.reduce((prev, val) => prev + val, 0) })
        .then(function (parsedBody) {
            console.log('[Carbon] Successfully posted to Carbon.');
        }).catch(function (err) {
            console.log("[Carbon] Failed to post to Carbon.");
        });
        request
        .post('https://bots.discord.pw/api/bots/' + config.botid + '/stats')
        .set({ 'Authorization': config.botskey })
        .send({ server_count: results.reduce((prev, val) => prev + val, 0) })
        .then(function (parsedBody) {
            console.log('[Discord Bots] Successfully posted to Discord Bots.');
        }).catch(function (err) {
            console.log(err);
            console.log("[Discord Bots] Failed to post to Discord Bots.");
        });
    });
});

client.on('guildDelete', guild => {
    console.log("[Guild] I have left the guild: " + guild.name + ", " + guild.owner.user.username + " (" + guild.id + ")...");
    client.guilds.get(config.server).channels.get('265503171835592704').send("I have left the guild: " + guild.name + " (Owner: " + guild.owner.user.username + ")...");
    client.shard.fetchClientValues('guilds.size').then(results => {
        console.log("[Guild Count] " + results.reduce((prev, val) => prev + val, 0));
        request
        .post('https://www.carbonitex.net/discord/data/botdata.php')
        .send({ key: config.carbonkey, servercount: results.reduce((prev, val) => prev + val, 0) })
        .then(function (parsedBody) {
            console.log('[Carbon] Successfully posted to Carbon.');
        }).catch(function (err) {
            console.log("[Carbon] Failed to post to Carbon.");
        });
        request
        .post('https://bots.discord.pw/api/bots/' + config.botid + '/stats')
        .set({ 'Authorization': config.botskey })
        .send({ server_count: results.reduce((prev, val) => prev + val, 0) })
        .then(function (parsedBody) {
            console.log('[Discord Bots] Successfully posted to Discord Bots.');
        }).catch(function (err) {
            console.log(err);
            console.log("[Discord Bots] Failed to post to Discord Bots.");
        });
    });
});

client.on('disconnect', () => {
    console.log('[Disconnect] A disconnection has occurred. Attempting to reboot...').then(p => process.exit(0));
});

client.once('ready', () => {
    console.log('[Ready] Logged in!');
    client.user.setGame(";help | dragonfire535");
});

process.on('unhandledRejection', function (reason, p) {
    console.log("[Error] A Possibly Unhandled Rejection has Occurred. " + reason);
});

client.login(config.token);