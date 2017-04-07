const commando = require('discord.js-commando');
const Jimp = require('jimp');

module.exports = class BobRossCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'bobross',
            aliases: [
                'bob',
                'ross'
            ],
            group: 'avataredit',
            memberName: 'bobross',
            description: 'Make Bob Ross draw your avatar. (;bobross @User)',
            examples: [';bobross @User'],
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
        console.log(`[Command] ${message.content}`);
        const user = args.user;
        let userAvatar = user.displayAvatarURL;
        userAvatar = userAvatar.replace('.jpg', '.png');
        userAvatar = userAvatar.replace('.gif', '.png');
        let images = [];
        images.push(Jimp.read(userAvatar));
        images.push(Jimp.read('./images/BobRoss.png'));
        images.push(Jimp.read('./images/BlankWhite.png'));
        const [avatar, bob, nothing] = await Promise.all(images);
        avatar.rotate(2);
        avatar.resize(300, 300);
        nothing.composite(avatar, 44, 85);
        nothing.composite(bob, 0, 0);
        nothing.getBuffer(Jimp.MIME_PNG, (err, buff) => {
            if (err) return message.say(':x: Error! Something went wrong!');
            return message.channel.sendFile(buff);
        });
    }
};
