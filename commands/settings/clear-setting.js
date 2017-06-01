const Command = require('../../structures/Command');
const settings = require('../../assets/json/clear-setting');

module.exports = class ClearSettingCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'clear-setting',
            group: 'settings',
            memberName: 'clear-setting',
            description: 'Removes a custom setting from your server.',
            guildOnly: true,
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    key: 'setting',
                    prompt: 'What setting do you want to clear?',
                    type: 'string',
                    validate: (setting) => {
                        if (settings.includes(setting)) return true;
                        else return `Please enter one of the following: ${settings.join(', ')}.`;
                    }
                }
            ]
        });
    }

    run(msg, args) {
        const { setting } = args;
        msg.guild.settings.remove(setting);
        return msg.say(`${setting} has been removed from your server settings.`);
    }
};
