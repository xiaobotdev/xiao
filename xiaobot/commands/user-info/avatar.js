const Command = require('../../structures/Command');

module.exports = class AvatarCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'avatar',
            group: 'user-info',
            memberName: 'avatar',
            description: 'Responds with a link to a user\'s avatar.',
            args: [
                {
                    key: 'user',
                    prompt: 'Which user would you like to get the avatar of?',
                    type: 'user',
                    default: ''
                }
            ]
        });
    }

    run(msg, args) {
        const user = args.user || msg.author;
        return msg.say(user.displayAvatarURL({ size: 2048 }));
    }
};
