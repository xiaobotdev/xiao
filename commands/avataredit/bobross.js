const { Command } = require('discord.js-commando');
const Jimp = require('jimp');

module.exports = class BobRossCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bobross',
            aliases: [
                'ross'
            ],
            group: 'avataredit',
            memberName: 'bobross',
            description: 'Make Bob Ross draw an avatar.',
            args: [{
                key: 'user',
                prompt: 'Which user would you like to edit the avatar of?',
                type: 'user'
            }]
        });
    }

    async run(msg, args) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('ATTACH_FILES'))
                return msg.say('This Command requires the `Attach Files` Permission.');
        const { user } = args;
        const avatarURL = user.avatarURL('png', 2048);
        if (!avatarURL) return msg.say('This user has no avatar.');
        const blank = new Jimp(600, 775, 0xFFFFFFFF);
        let images = [];
        images.push(Jimp.read(avatarURL));
        images.push(Jimp.read('https://i.imgur.com/7NSiFLd.png'));
        const [avatar, bob] = await Promise.all(images);
        avatar.rotate(2);
        avatar.resize(300, 300);
        blank.composite(avatar, 44, 85);
        blank.composite(bob, 0, 0);
        blank.getBuffer(Jimp.MIME_PNG, (err, buff) => {
            if (err) return msg.say('An Unknown Error Occurred.');
            return msg.channel.send({files: [{attachment: buff}]})
                .catch(() => msg.say('An Unknown Error Occurred.'));
        });
    }
};
