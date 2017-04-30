const { Command } = require('discord.js-commando');

module.exports = class StaffRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'staffrole',
            group: 'util',
            memberName: 'staffrole',
            description: 'Sets the role that can use Mod Commands without perms.',
            guildOnly: true,
            args: [{
                key: 'role',
                prompt: 'What role should be staff?',
                type: 'role'
            }]
        });
    }
    
    hasPermission(msg) {
        return msg.member.permissions.has('ADMINISTRATOR');
    }

    run(message, args) {
        const { role } = args;
        message.guild.settings.set('staffRole', role.name);
        return message.say(`Server Staff role set to ${role.name}.`);
    }
};
