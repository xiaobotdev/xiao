const { Command } = require('discord.js-commando');

module.exports = class SpamCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'spam',
            group: 'random',
            memberName: 'spam',
            description: 'Puts a picture of Spam.'
        });
    }

    run(message) {
        if (message.channel.type !== 'dm')
            if (!message.channel.permissionsFor(this.client.user).permissions.has('ATTACH_FILES'))
                return message.say('This Command requires the `Attach Files` Permission.');
        return message.channel.send({files: ['./images/Spam.jpg']});
    }
};
