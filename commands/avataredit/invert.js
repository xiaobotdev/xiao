const { Command } = require('discord.js-commando');
const Jimp = require('jimp');

module.exports = class InvertCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'invert',
            group: 'avataredit',
            memberName: 'invert',
            description: 'Invert a user\'s avatar colors.',
            args: [
                {
                    key: 'user',
                    prompt: 'Which user would you like to edit the avatar of?',
                    type: 'user'
                }
            ]
        });
    }

    async run(msg, args) {
        if(msg.channel.type !== 'dm')
            if(!msg.channel.permissionsFor(this.client.user).has('ATTACH_FILES'))
                return msg.say('This Command requires the `Attach Files` Permission.');
        const { user } = args;
        const avatarURL = user.avatarURL('png', 2048);
        if(!avatarURL) return msg.say('This user has no avatar.');
        const avatar = await Jimp.read(avatarURL);
        avatar.invert();
        avatar.getBuffer(Jimp.MIME_PNG, (err, buff) => {
            if(err) return msg.say(`An Error Occurred: ${err}`);
            return msg.channel.send({ files: [{ attachment: buff, name: 'invert.png' }] })
                .catch(err => msg.say(`An Error Occurred: ${err}`));
        });
    }
};
