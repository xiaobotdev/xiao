const commando = require('discord.js-commando');
const zalgo = require('zalgolize');

module.exports = class ZalgoCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'zalgo',
            group: 'textedit',
            memberName: 'zalgo',
            description: 'Zalgoizes Text (;zalgo This Text)',
            examples: [';zalgo This Text'],
            args: [{
                key: 'text',
                prompt: 'What text would you like to convert to zalgo?',
                type: 'string',
                validate: content => {
                    if (zalgo(content).length > 1950) {
                        return 'Your message content is too long.';
                    }
                    return true;
                }
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const zalgoified = zalgo(args.text);
        return message.say(`\u180E${zalgoified}`);
    }
};
