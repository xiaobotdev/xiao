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
            description: 'Puts a profile picture over a gravestone. (;rip @User)',
            examples: [';rip @User'],
            args: [{
                key: 'user',
                prompt: 'Which user would you like to edit the avatar of?',
                type: 'user'
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('ATTACH_FILES')) return message.say(':x: Error! I don\'t have the Attach Files Permission!');
        }
        const user = args.user;
        let userAvatar = user.displayAvatarURL;
        userAvatar = userAvatar.replace('.jpg', '.png');
        userAvatar = userAvatar.replace('.gif', '.png');
        let images = [];
        images.push(Jimp.read(userAvatar));
        images.push(Jimp.read('./images/gravestone.jpg'));
        const [avatar, gravestone] = await Promise.all(images);
        avatar.resize(200, 200);
        gravestone.blit(avatar, 60, 65);
        gravestone.getBuffer(Jimp.MIME_PNG, (err, buff) => {
            if (err) return message.say(':x: Error! Something went wrong!');
            return message.channel.sendFile(buff);
        });
    }
};
