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
        const modLog = msg.guild.channels.get(msg.guild.settings.get('modLog'));
        const memberLog = msg.guild.channels.get(msg.guild.settings.get('memberLog'));
        const singleRole = msg.guild.roles.get(msg.guild.settings.get('singleRole'));
        const joinRole = msg.guild.roles.get(msg.guild.settings.get('joinRole'));
        const starboard = msg.guild.channels.get(msg.guild.settings.get('starboard'));
        return msg.say(stripIndents`
            **Prefix:** ${msg.guild.commandPrefix}
            **Invite Guard:** ${msg.guild.settings.get('inviteGuard', false)}
            **Mod Channel:** ${modLog ? modLog.name : 'None'}
            **Starboard:** ${starboard ? starboard.name : 'None'}
            **Join Role:** ${joinRole ? joinRole.name : 'None'}
            **Member Channel:** ${memberLog ? memberLog.name : 'None'}
            **Join Message:** ${msg.guild.settings.get('joinMsg', 'Welcome <user>! (Default)')}
            **Leave Message:** ${msg.guild.settings.get('leaveMsg', 'Bye <user>... (Default)')}
            **Single Role:** ${singleRole ? singleRole.name : 'None'}
        `);
    }
};
