const { TOKEN, OWNER, PREFIX, INVITE } = process.env;
const path = require('path');
const CommandoClient = require('./structures/CommandoClient');
const client = new CommandoClient({
    commandPrefix: PREFIX,
    owner: OWNER,
    invite: INVITE,
    disableEveryone: true
});
const { carbon, dBots } = require('./structures/Stats');
const SequelizeProvider = require('./providers/Sequelize');

client.setProvider(new SequelizeProvider(client.database));

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['userinfo', 'User Info'],
        ['guildinfo', 'Server Info'],
        ['moderation', 'Moderation'],
        ['settings', 'Server Settings'],
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
    .registerDefaultCommands({
        help: false,
        ping: false
    })
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', () => {
    console.log(`[READY] Shard ${client.shard.id} Logged in as ${client.user.tag} (${client.user.id})!`);
    client.user.setGame(`${PREFIX}help | Shard ${client.shard.id}`);
});

client.on('disconnect', (event) => {
    console.log(`[DISCONNECT] Shard ${client.shard.id} disconnected with Code ${event.code}.`);
    process.exit(0);
});

client.on('error', console.error);

client.on('warn', console.warn);

client.on('commandError', (command, err) => console.error(command.name, err));

client.dispatcher.addInhibitor(msg => {
    if (msg.channel.type === 'dm') {
        return false;
    }
    const role = msg.guild.settings.get('singleRole');
    if (!msg.guild.roles.has(role) || msg.member.hasPermission('ADMINISTRATOR')) {
        return false;
    }
    if (!msg.member.roles.has(role)) {
        return ['singleRole', msg.reply(`Only the ${msg.guild.roles.get(role).name} role may use commands.`)];
    } else {
        return false;
    }
});

client.on('message', (msg) => {
    if (!msg.guild || !msg.guild.settings.get('inviteGuard')) return;
    if (/(discord(\.gg\/|app\.com\/invite\/|\.me\/))/gi.test(msg.content)) {
        if (msg.author.bot || msg.member.hasPermission('ADMINISTRATOR')) return;
        if (msg.channel.permissionsFor(client.user).has(['SEND_MESSAGES', 'MANAGE_MESSAGES'])) {
            msg.delete();
            return msg.reply('Invites are prohibited from being posted here.');
        }
    }
});

client.on('messageReactionAdd', (reaction, user) => {
    if (reaction.emoji.name !== '⭐') return;
    const { message } = reaction;
    const channel = message.guild.channels.get(message.guild.settings.get('starboard'));
    if (!channel) return;
    if (user.id === message.author.id) {
        if (message.channel.permissionsFor(client.user).has(['SEND_MESSAGES', 'MANAGE_MESSAGES'])) {
            reaction.remove(user);
            return message.reply('You cannot star your own messages, baka.');
        } else return;
    }
    return client.registry.resolveCommand('random:star').run(message, { id: message.id }, true);
});

client.on('guildMemberAdd', (member) => {
    const role = member.guild.roles.get(member.guild.settings.get('joinRole'));
    if (role && member.guild.me.hasPermission('MANAGE_ROLES')) {
        member.addRole(role).catch(() => null);
    }
    const channel = member.guild.channels.get(member.guild.settings.get('memberLog'));
    if (!channel || !channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    const msg = member.guild.settings.get('joinMsg', 'Welcome <user>!')
        .replace(/(<user>)/gi, member.user.username)
        .replace(/(<server>)/gi, member.guild.name)
        .replace(/(<mention>)/gi, member);
    return channel.send(msg);
});

client.on('guildMemberRemove', (member) => {
    const channel = member.guild.channels.get(member.guild.settings.get('memberLog'));
    if (!channel || !channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
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
    carbon(count);
    dBots(count, client.user.id);
});

client.on('guildDelete', async (guild) => {
    console.log(`[Guild] I have left ${guild.name}... (${guild.id})`);
    const guilds = await client.shard.fetchClientValues('guilds.size');
    const count = guilds.reduce((prev, val) => prev + val, 0);
    carbon(count);
    dBots(count, client.user.id);
});

client.setTimeout(() => {
    console.log(`[Restart] Shard ${client.shard.id} Restarted.`);
    process.exit(0);
}, 14400000);

client.login(TOKEN);

process.on('unhandledRejection', console.error);
