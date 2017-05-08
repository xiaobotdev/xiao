const { Command } = require('discord.js-commando');
const Jimp = require('jimp');

module.exports = class TriggeredCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'triggered',
            group: 'avataredit',
            memberName: 'triggered',
            description: 'Put an avatar on a "Triggered" sign.',
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
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('ATTACH_FILES'))
                return msg.say('This Command requires the `Attach Files` Permission.');
        const { user } = args;
        const avatarURL = user.avatarURL('png', 2048);
        if (!avatarURL) return msg.say('This user has no avatar.');
        const blank = new Jimp(320, 371, 0xFFFFFFFF);
        const images = [];
        images.push(Jimp.read(avatarURL));
        images.push(Jimp.read('https://i.imgur.com/tF9yF62.png'));
        const [avatar, triggered] = await Promise.all(images);
        avatar.resize(320, 320);
        blank.composite(avatar, 0, 0);
        blank.composite(triggered, 0, 0);
        blank.getBuffer(Jimp.MIME_PNG, (err, buff) => {
            if (err) return msg.say(err);
            return msg.channel.send({ files: [{ attachment: buff, name: 'triggered.png' }] })
                .catch(err => msg.say(err));
        });
    }
};
