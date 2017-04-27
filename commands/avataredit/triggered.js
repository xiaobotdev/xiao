const { Command } = require('discord.js-commando');
const Jimp = require('jimp');

module.exports = class TriggeredCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'triggered',
            group: 'avataredit',
            memberName: 'triggered',
            description: 'Put an avatar on a "Triggered" sign.',
            args: [{
                key: 'user',
                prompt: 'Which user would you like to edit the avatar of?',
                type: 'user'
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm')
            if (!message.channel.permissionsFor(this.client.user).has('ATTACH_FILES'))
                return message.say('This Command requires the `Attach Files` Permission.');
        const { user } = args;
        const userAvatar = user.displayAvatarURL.replace(/(png|jpg|jpeg|gif|webp)/, 'png');
        const blank = new Jimp(320, 371, 0xFFFFFF);
        let images = [];
        images.push(Jimp.read(userAvatar));
        images.push(Jimp.read('https://i.imgur.com/tF9yF62.png'));
        const [avatar, triggered] = await Promise.all(images);
        avatar.resize(320, 320);
        blank.composite(avatar, 0, 0);
        blank.composite(triggered, 0, 0);
        blank.getBuffer(Jimp.MIME_PNG, (err, buff) => {
            if (err) return message.say('An Unknown Error Occurred.');
            return message.channel.send({files: [{attachment: buff}]});
        });
    }
};
