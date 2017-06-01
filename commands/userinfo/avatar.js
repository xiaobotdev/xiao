const Command = require('../../structures/Command');

module.exports = class AvatarCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'avatar',
            group: 'userinfo',
            memberName: 'avatar',
            description: 'Gives a link to a user\'s avatar.',
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
        return msg.say(user.avatarURL('webp', 2048) || user.displayAvatarURL);
    }
};
