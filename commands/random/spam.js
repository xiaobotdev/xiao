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
        return msg.channel.send({ files: ['https://i.imgur.com/2JFu5xE.jpg'] })
            .catch(err => msg.say(err));
    }
};
