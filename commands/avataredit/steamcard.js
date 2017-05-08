const { Command } = require('discord.js-commando');
const Jimp = require('jimp');

module.exports = class SteamCardCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'steam-card',
            aliases: ['card'],
            group: 'avataredit',
            memberName: 'steam-card',
            description: 'Put an avatar on a Steam Card.',
            args: [
                {
                    key: 'user',
                    prompt: 'Which user would you like to edit the avatar of?',
                    type: 'user'
                }
            ]
        });
    }

    async run(msg, args) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('ATTACH_FILES'))
                return msg.say('This Command requires the `Attach Files` Permission.');
        const { user } = args;
        const username = msg.guild ? msg.guild.member(user).displayName : user.username;
        const avatarURL = user.avatarURL('png', 2048);
        if (!avatarURL) return msg.say('This user has no avatar.');
        const blank = new Jimp(494, 568, 0xFFFFFFFF);
        let images = [];
        images.push(Jimp.read(avatarURL));
        images.push(Jimp.read('https://i.imgur.com/JF0WwQX.png'));
        const [avatar, card] = await Promise.all(images);
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
        avatar.resize(450, 450);
        blank.composite(avatar, 25, 25);
        blank.composite(card, 0, 0);
        blank.print(font, 38, 20, username);
        blank.getBuffer(Jimp.MIME_PNG, (err, buff) => {
            if (err) return msg.say(`An Error Occurred: ${err}`);
            return msg.channel.send({ files: [{ attachment: buff, name: 'steamcard.png' }] })
                .catch(err => msg.say(`An Error Occurred: ${err}`));
        });
    }
};
