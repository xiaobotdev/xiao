const { Command } = require('discord.js-commando');
const path = require('path');

module.exports = class SpamCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'spam',
            group: 'random',
            memberName: 'spam',
            description: 'Puts a picture of Spam.'
        });
    }

    run(msg) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('ATTACH_FILES'))
                return msg.say('This Command requires the `Attach Files` Permission.');
        return msg.say({ files: [path.join(__dirname, '..', '..', 'assets', 'images', 'spam.png')] })
            .catch(err => msg.say(`${err.name}: ${err.message}`));
    }
};
