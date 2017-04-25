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
            if (!message.channel.permissionsFor(this.client.user).hasPermission('ATTACH_FILES'))
                return message.say(':x: Error! I don\'t have the Attach Files Permission!');
        const { user } = args;
        const userAvatar = user.displayAvatarURL.replace('.jpg', '.png').replace('.gif', '.png');
        let images = [];
        images.push(Jimp.read(userAvatar));
        images.push(Jimp.read('./images/gravestone.png'));
        const [avatar, gravestone] = await Promise.all(images);
        avatar.resize(200, 200);
        gravestone.blit(avatar, 158, 51);
        gravestone.getBuffer(Jimp.MIME_PNG, (err, buff) => {
            if (err) return message.say(':x: Error! Something went wrong!');
            return message.channel.send({files: [{attachment: buff}]});
        });
    }
};
