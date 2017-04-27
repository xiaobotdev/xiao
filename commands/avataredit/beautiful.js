const { Command } = require('discord.js-commando');
const Jimp = require('jimp');

module.exports = class BeautifulCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'beautiful',
            aliases: [
                'grunklestan'
            ],
            group: 'avataredit',
            memberName: 'beautiful',
            description: 'Oh, this? This is beautiful.',
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
        let images = [];
        images.push(Jimp.read(userAvatar));
        images.push(Jimp.read('https://i.imgur.com/OOQ9QwQ.jpg'));
        const [avatar, beautiful] = await Promise.all(images);
        avatar.resize(200, 200);
        beautiful.blit(avatar, 432, 42);
        avatar.resize(190, 190);
        beautiful.blit(avatar, 451, 434);
        beautiful.getBuffer(Jimp.MIME_PNG, (err, buff) => {
            if (err) return message.say('An Unknown Error Occurred.');
            return message.channel.send({files: [{attachment: buff}]});
        });
    }
};
