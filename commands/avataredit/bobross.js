const { Command } = require('discord.js-commando');
const Jimp = require('jimp');

module.exports = class BobRossCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bobross',
            aliases: [
                'bob',
                'ross'
            ],
            group: 'avataredit',
            memberName: 'bobross',
            description: 'Make Bob Ross draw your avatar. (x;bobross @User)',
            examples: ['x;bobross @User'],
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
        const { user } = args;
        const userAvatar = user.displayAvatarURL.replace('.jpg', '.png').replace('.gif', '.png');
        const blank = new Jimp(600, 775, 0xFFFFFF);
        let images = [];
        images.push(Jimp.read(userAvatar));
        images.push(Jimp.read('./images/BobRoss.png'));
        const [avatar, bob] = await Promise.all(images);
        avatar.rotate(2);
        avatar.resize(300, 300);
        blank.composite(avatar, 44, 85);
        blank.composite(bob, 0, 0);
        blank.getBuffer(Jimp.MIME_PNG, (err, buff) => {
            if (err) return message.say(':x: Error! Something went wrong!');
            return message.channel.send({files: [{attachment: buff}]});
        });
    }
};
