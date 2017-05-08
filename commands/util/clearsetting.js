const { Command } = require('discord.js-commando');

module.exports = class ClearSettingCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'clear-setting',
            group: 'util',
            memberName: 'clear-setting',
            description: 'Removes a custom-set Mod Channel, Member Channel, Member Message, Staff Role, or Single Role.',
            guildOnly: true,
            args: [
                {
                    key: 'setting',
                    prompt: 'What setting do you want to clear? `modLog`, `memberLog`, `joinMsg`, `leaveMsg`, `staffRole`, or `singleRole`?',
                    type: 'string',
                    validate: setting => {
                        if (['modLog', 'memberLog', 'joinMsg', 'leaveMsg', 'staffRole', 'singleRole'].includes(setting)) return true;
                        return 'Please enter either `modLog`, `memberLog`, `joinMsg`, `leaveMsg`, `staffRole`, or `singleRole`.';
                    }
                }
            ]
        });
    }
    
    hasPermission(msg) {
        return msg.member.hasPermission('ADMINISTRATOR');
    }

    run(msg, args) {
        const { setting } = args;
        msg.guild.settings.remove(setting);
        return msg.say(`${setting} has been removed from your guild settings.`);
    }
};
