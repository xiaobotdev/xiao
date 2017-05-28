const { Command } = require('discord.js-commando');

module.exports = class InviteGuardCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'invite-guard',
            group: 'settings',
            memberName: 'invite-guard',
            description: 'Configures auto-delete for invites.',
            guildOnly: true
        });
    }

    hasPermission(msg) {
        if (!msg.member.hasPermission('ADMINISTRATOR')) return 'You do not have the `Administrator` Permission.';
        else return true;
    }

    run(msg) {
        msg.guild.settings.set('inviteGuard', true);
        return msg.say('Invite Guard is now active.');
    }
};
