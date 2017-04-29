const { Command } = require('discord.js-commando');
const Jimp = require('jimp');

module.exports = class SteamCardCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'steamcard',
            aliases: [
                'card'
            ],
            group: 'avataredit',
            memberName: 'steamcard',
            description: 'Put an avatar on a Steam Card.',
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
        const username = message.guild ? message.guild.member(user).displayName : user.username;
        const userAvatar = user.displayAvatarURL.replace(/(png|jpg|jpeg|gif|webp)/, 'png');
        const blank = new Jimp(494, 568, 0xFFFFFFFF);
        let images = [];
        images.push(Jimp.read(userAvatar));
        images.push(Jimp.read('https://i.imgur.com/JF0WwQX.png'));
        const [avatar, steamcard] = await Promise.all(images);
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
        avatar.resize(450, 450);
        blank.composite(avatar, 25, 25);
        blank.composite(steamcard, 0, 0);
        blank.print(font, 38, 20, username);
        blank.getBuffer(Jimp.MIME_PNG, (err, buff) => {
            if (err) return message.say('An Unknown Error Occurred.');
            return message.channel.send({files: [{attachment: buff}]});
        });
    }
};
