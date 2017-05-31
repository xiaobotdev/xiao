const Command = require('../../structures/Command');

module.exports = class InviteGuardCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'invite-guard',
            group: 'settings',
            memberName: 'invite-guard',
            description: 'Configures auto-delete for invites.',
            guildOnly: true,
            userPermissions: ['ADMINISTRATOR']
        });
    }

    run(msg) {
        msg.guild.settings.set('inviteGuard', true);
        return msg.say('Invite Guard is now active.');
    }
};
