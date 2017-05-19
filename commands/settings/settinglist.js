const { Command } = require('discord.js-commando');
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
        return msg.say(stripIndents`
            **Prefix:** ${msg.guild.commandPrefix}
            **Invite Guard:** ${msg.guild.settings.get('guard', false)}
            **Staff Role:** ${staffRole ? msg.guild.roles.get(staffRole).name : 'None'}
            **Mod Channel:** ${modLog ? msg.guild.channels.get(modLog).name: 'None'}
            **Member Channel:** ${memberLog ? msg.guild.channels.get(memberLog).name : 'None'}
            **Join Message:** ${msg.guild.settings.get('joinMsg', 'Welcome <user>! (Not Set)')}
            **Leave Message:** ${msg.guild.settings.get('leaveMsg', 'Bye <user>... (Not Set)')}
            **Single Role:** ${singleRole ? msg.guild.roles.get(singleRole).name : 'None'}
        `);
    }
};
