const Command = require('../../structures/Command');

module.exports = class JoinRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'join-role',
            group: 'settings',
            memberName: 'join-role',
            description: 'Sets a role that new members are automatically joined to.',
            guildOnly: true,
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    key: 'role',
                    prompt: 'What role should new members be joined to?',
                    type: 'role'
                }
            ]
        });
    }

    run(msg, args) {
        const { role } = args;
        msg.guild.settings.set('joinRole', role.id);
        return msg.say(`Join Role set to ${role.name}.`);
    }
};
