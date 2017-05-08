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

    run(msg) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('ATTACH_FILES'))
                return msg.say('This Command requires the `Attach Files` Permission.');
        return msg.channel.send({ files: ['https://i.imgur.com/2JFu5xE.jpg'] })
            .catch(err => msg.say(err));
    }
};
