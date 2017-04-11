const commando = require('discord.js-commando');
const Jimp = require('jimp');

module.exports = class SteamCardCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'steamcard',
            aliases: [
                'card'
            ],
            group: 'avataredit',
            memberName: 'steamcard',
            description: 'Put an avatar on a Steam Card. (;steamcard @User)',
            examples: [';steamcard @user'],
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
        const userDisplayName = message.guild ? message.guild.member(user).displayName : user.username;
        let userAvatar = user.displayAvatarURL;
        userAvatar = userAvatar.replace('.jpg', '.png');
        userAvatar = userAvatar.replace('.gif', '.png');
        let images = [];
        images.push(Jimp.read(userAvatar));
        images.push(Jimp.read('./images/SteamCard.png'));
        images.push(Jimp.read('./images/SteamCardBlank.png'));
        const [avatar, steamcard, nothing] = await Promise.all(images);
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
        avatar.resize(450, 450);
        nothing.composite(avatar, 25, 25);
        nothing.composite(steamcard, 0, 0);
        nothing.print(font, 38, 20, userDisplayName);
        nothing.getBuffer(Jimp.MIME_PNG, (err, buff) => {
            if (err) return message.say(':x: Error! Something went wrong!');
            return message.channel.sendFile(buff);
        });
    }
};
