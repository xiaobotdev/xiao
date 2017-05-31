const Command = require('../../structures/Command');

module.exports = class SingleRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'single-role',
            group: 'settings',
            memberName: 'single-role',
            description: 'Sets a single role that is able to use commands.',
            guildOnly: true,
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    key: 'role',
                    prompt: 'What role should be able to use commands?',
                    type: 'role'
                }
            ]
        });
    }

    run(msg, args) {
        const { role } = args;
        msg.guild.settings.set('singleRole', role.id);
        return msg.say(`Single role mode has been enabled with the role ${role.name}.`);
    }
};
