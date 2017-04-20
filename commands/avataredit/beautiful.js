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
            description: 'Oh, this? This is beautiful. (;beautiful @User)',
            examples: [';beautiful @User'],
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
        let images = [];
        images.push(Jimp.read(userAvatar));
        images.push(Jimp.read('./images/beautiful.jpg'));
        const [avatar, beautiful] = await Promise.all(images);
        avatar.resize(200, 200);
        beautiful.blit(avatar, 432, 42);
        avatar.resize(190, 190);
        beautiful.blit(avatar, 451, 434);
        beautiful.getBuffer(Jimp.MIME_PNG, (err, buff) => {
            if (err) return message.say(':x: Error! Something went wrong!');
            return message.channel.send({files: [{attachment: buff}]});
        });
    }
};
