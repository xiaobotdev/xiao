const { TOKEN, OWNER, PREFIX, INVITE, CLEVS_KEY, CLEVS_USER, CLEVS_NICK } = process.env;

const { CommandoClient } = require('discord.js-commando');
const client = new CommandoClient({
    commandPrefix: PREFIX,
    owner: OWNER,
    disableEveryone: true,
    invite: INVITE,
    unknownCommandResponse: false
});
const path = require('path');

const { carbon, dBots } = require('./structures/Stats');

const SequelizeProvider = require('./providers/Sequelize');
const Database = require('./structures/PostgreSQL');
Database.start();

const Cleverbot = require('./structures/Cleverbot');
const clevs = new Cleverbot({
    key: CLEVS_KEY,
    user: CLEVS_USER,
    nick: CLEVS_NICK
});
clevs.create();

let mention;

client.setProvider(new SequelizeProvider(Database.db));

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
        ['numedit', 'Number Manipulation'],
        ['search', 'Search'],
        ['games', 'Games'],
        ['random', 'Random/Other'],
        ['roleplay', 'Roleplay']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands({ help: false })
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('message', async (msg) => {
    if (msg.author.bot) return;
    if (msg.channel.type !== 'dm')
        if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    if (msg.isMentioned(client.user)) {
        msg.channel.startTyping();
        const message = msg.content.replace(mention, '');
        try {
            const { response } = await clevs.ask(message);
            return msg.reply(response)
                .then(() => msg.channel.stopTyping());
        } catch (err) {
            return msg.reply(err)
                .then(() => msg.channel.stopTyping());
        }
    } else return;
});

client.dispatcher.addInhibitor(msg => {
    if (msg.channel.type === 'dm') return false;
    const role = msg.guild.settings.get('singleRole');
    if (!role) return false;
    if (client.isOwner(msg.author)) return false;
    if (msg.member.hasPermission('ADMINISTRATOR')) return false;
    if (!msg.member.roles.has(role))
        return ['singleRole', msg.reply(`Only the ${msg.guild.roles.get(role).name} role may use commands.`)];
});

client.on('guildMemberAdd', (member) => {
    const channel = member.guild.channels.get(member.guild.settings.get('memberLog'));
    if (!channel) return;
    if (!channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    const msg = member.guild.settings.get('joinMsg', 'Welcome <user>!')
        .replace(/(<user>)/gi, member.user.username)
        .replace(/(<server>)/gi, member.guild.name)
        .replace(/(<mention>)/gi, member);
    return channel.send(msg);
});

client.on('guildMemberRemove', (member) => {
    const channel = member.guild.channels.get(member.guild.settings.get('memberLog'));
    if (!channel) return;
    if (!channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    const msg = member.guild.settings.get('leaveMsg', 'Bye <user>...')
        .replace(/(<user>)/gi, member.user.username)
        .replace(/(<server>)/gi, member.guild.name)
        .replace(/(<mention>)/gi, member);
    return channel.send(msg);
});

client.on('guildCreate', async (guild) => {
    console.log(`[Guild] I have joined ${guild.name}! (${guild.id})`);
    const guilds = await client.shard.fetchClientValues('guilds.size');
    const count = guilds.reduce((prev, val) => prev + val, 0);
    console.log(`[Count] ${count}`);
    carbon(count);
    dBots(count, client.user.id);
});

client.on('guildDelete', async (guild) => {
    console.log(`[Guild] I have left ${guild.name}... (${guild.id})`);
    const guilds = await client.shard.fetchClientValues('guilds.size');
    const count = guilds.reduce((prev, val) => prev + val, 0);
    console.log(`[Count] ${count}`);
    carbon(count);
    dBots(count, client.user.id);
});

client.setTimeout(() => {
    console.log(`[Restart] Shard ${client.shard.id} Restarted.`);
    process.exit(0);
}, 14400000);

client.on('disconnect', (event) => {
    console.log(`[Disconnect] Shard ${client.shard.id} disconnected with Code ${event.code}.`);
    process.exit(0);
});

client.on('ready', () => {
    console.log(`[Ready] Shard ${client.shard.id} Logged in!`);
    client.user.setGame(`x;help | Shard ${client.shard.id}`);
    mention = new RegExp(`(<!?@${client.user.id}>)`, 'g');
});

client.login(TOKEN);

process.on('unhandledRejection', console.error);
