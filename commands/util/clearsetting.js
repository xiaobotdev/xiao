const { Command } = require('discord.js-commando');

module.exports = class ClearSettingCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'clearsetting',
            group: 'util',
            memberName: 'clearsetting',
            description: 'Removes a custom-set Mod Channel, Member Channel, or Staff Role.',
            guildOnly: true,
            args: [{
                key: 'setting',
                prompt: 'What setting do you want to clear? `modLog`, `memberLog`, or `staffRole`?',
                type: 'string',
                validate: setting => {
                    if (['modLog', 'memberLog', 'staffRole'].includes(setting))
                        return true;
                    return 'Please enter either `modLog`, `memberLog`, or `staffRole`.';
                }
            }]
        });
    }
    
    hasPermission(msg) {
        return msg.member.permissions.has('ADMINISTRATOR');
    }

    run(message, args) {
        const { setting } = args;
        message.guild.settings.remove(setting);
        return message.say(`${setting} has been removed from your guild settings.`);
    }
};
