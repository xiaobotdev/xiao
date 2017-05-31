const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class SettingListCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'setting-list',
            group: 'settings',
            memberName: 'setting-list',
            description: 'Shows a list of current guild settings.',
            guildOnly: true
        });
    }

    run(msg) {
        const staffRole = msg.guild.settings.get('staffRole', false);
        const modLog = msg.guild.settings.get('modLog', false);
        const memberLog = msg.guild.settings.get('memberLog', false);
        const singleRole = msg.guild.settings.get('singleRole', false);
        const joinRole = msg.guild.settings.get('joinRole', false);
        const starboard = msg.guild.settings.get('starboard', false);
        return msg.say(stripIndents`
            **Prefix:** ${msg.guild.commandPrefix}
            **Invite Guard:** ${msg.guild.settings.get('inviteGuard', false)}
            **Staff Role:** ${staffRole ? (msg.guild.roles.has(staffRole) ? msg.guild.roles.get(staffRole).name : 'Missing') : 'None'}
            **Mod Channel:** ${modLog ? (msg.guild.channels.has(modLog) ? msg.guild.channels.get(modLog).name : 'Missing') : 'None'}
            **Starboard:** ${starboard ? (msg.guild.channels.has(starboard) ? msg.guild.channels.get(starboard).name : 'Missing') : 'None'}
            **Join Role:** ${joinRole ? (msg.guild.roles.has(joinRole) ? msg.guild.roles.get(joinRole).name : 'Missing') : 'None'}
            **Member Channel:** ${memberLog ? (msg.guild.channels.has(memberLog) ? msg.guild.channels.get(memberLog).name : 'Missing') : 'None'}
            **Join Message:** ${msg.guild.settings.get('joinMsg', 'Welcome <user>! (Default)')}
            **Leave Message:** ${msg.guild.settings.get('leaveMsg', 'Bye <user>... (Default)')}
            **Single Role:** ${singleRole ? (msg.guild.roles.has(singleRole) ? msg.guild.roles.get(singleRole).name : 'Missing') : 'None'}
        `);
    }
};
