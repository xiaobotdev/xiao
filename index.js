const Discord = require('discord.js');
const commando = require('discord.js-commando');
const config = require('./config.json');
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
    ['pokemon', 'Pokémon'],
    ['random', 'Random/Other'],
    ['roleplay', 'Roleplay']
])
.registerDefaultGroups()
.registerDefaultCommands()
.registerCommandsIn(path.join(__dirname, 'commands'));

client.on('message', (message) => {
    if(message.author.bot) return;
    if(message.content.startsWith(';servers')) {
        if(message.author.id !== config.owner) return;
        console.log("[Command] " + message.content);
        console.log(client.guilds.array().length + " Servers: " + client.guilds.map(g => g.name + " (" + g.id + ")").join(", "));
        message.reply("Sent the information to the console!");
    }
    if(message.content.startsWith(';leave')) {
        if(message.author.id !== config.owner) return;
        console.log("[Command] " + message.content);
        message.reply("Reminder: To leave a server, eval `this.client.guilds.get(<ID>).leave();`");
    }
    if(message.content.includes("(╯°□°）╯︵ ┻━┻")) {
        if(message.channel.type !== 'dm') {
            if(message.guild.id === "110373943822540800") return;
        }
        console.log("[Command] " + message.content);
        message.reply("Calm down!   ┬─┬ ノ( ゜-゜ノ)");
    }
    if(message.content.includes(":Swagolor:")) {
        if(message.guild.id !== "252317073814978561") return;
        message.channel.sendMessage(message.guild.emojis.get('254827709459333120').toString());
    }
    if(message.channel.type !== 'dm') {
        if (message.content.startsWith("<@" + client.user.id + ">")){
            if(message.guild.id === "252317073814978561") {
                console.log("[Cleverbot] " + message.content);
                if(message.author.id === clevusers.allowed[message.author.id]) {
                    let cleverMessage = message.content.replace("<@" + client.user.id + ">", "");
                    cleverMessage = cleverMessage.replace("", '');
                    message.channel.startTyping();
                    cleverbot.write(cleverMessage, function (response) {
                        message.reply(response.output);
                        message.channel.stopTyping();
                    });
                } else {
                    message.reply(":x: Error! You are either not verified for Cleverbot, or banned from it. Please check #rules for a link to the forum to sign-up for Cleverbot.");
                }
            }
        }
    }
});

client.on('guildMemberAdd', member => {
    if(member.guild.id !== "252317073814978561") return;
    member.addRole(member.guild.roles.find('name', 'Members'));
    let username = member.user.username;
    member.guild.defaultChannel.send('Welcome ' + username + '!');
});

client.on('guildMemberRemove', member => {
    if(member.guild.id !== "252317073814978561") return;
    let username = member.user.username;
    member.guild.defaultChannel.send('Bye ' + username + '...');
});

client.on('guildCreate', guild => {
    console.log("[Guild] I have joined the guild: " + guild.name + " (" + guild.id + ")...");
});

client.on('guildDelete', guild => {
    console.log("[Guild] I have left the guild: " + guild.name + " (" + guild.id + ")...");
});
    
client.setInterval(()=>{
    let games = ["with a cardboard box", "with Rem", "with my cat", "in the fridge", "in " + client.guilds.size + " servers", "with dragonfire535", "at the Inn", "with your heart", "with a knife", "with a murderous cow", ";help | dragonfire535", "with Cleverbot", "like a pirate", "with all my games", "against Miki", "with " + client.users.size + " Users"][Math.floor(Math.random() * 16)];
    client.user.setGame(games);
}, 300000);

client.once('ready', () => {
    console.log('[Ready] Logged in!');
    client.user.setGame("Just Started Up!");
});

client.login(config.token);