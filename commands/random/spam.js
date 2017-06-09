const Command = require('../../structures/Command');

module.exports = class SpamCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'spam',
            group: 'random',
            memberName: 'spam',
            description: 'Puts a picture of Spam.',
            clientPermissions: ['ATTACH_FILES']
        });
    }

    run(msg) {
        return msg.say('https://i.imgur.com/arx7GJV.jpg');
    }
};
