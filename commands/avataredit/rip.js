const { Command } = require('discord.js-commando');
const Jimp = require('jimp');

module.exports = class RIPCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'rip',
            aliases: [
                'grave',
                'gravestone'
            ],
            group: 'avataredit',
            memberName: 'rip',
            description: 'Puts a user\'s avatar over a gravestone.',
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
        const avatarURL = user.displayAvatarURL.replace(/(png|jpg|jpeg|gif|webp)/, 'png');
        let images = [];
        images.push(Jimp.read(avatarURL));
        images.push(Jimp.read('https://i.imgur.com/KriteWm.jpg'));
        const [avatar, grave] = await Promise.all(images);
        avatar.resize(200, 200);
        grave.composite(avatar, 158, 51);
        grave.getBuffer(Jimp.MIME_PNG, (err, buff) => {
            if (err) return message.say('An Unknown Error Occurred.');
            return message.channel.send({files: [{attachment: buff}]});
        });
    }
};
