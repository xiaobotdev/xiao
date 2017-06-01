const Command = require('../../structures/Command');
const Canvas = require('canvas');
const snekfetch = require('snekfetch');
const { promisifyAll } = require('tsubaki');
const fs = promisifyAll(require('fs'));
const path = require('path');

module.exports = class SteamCardCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'steam-card',
            group: 'avataredit',
            memberName: 'steam-card',
            description: 'Put an avatar on a Steam Card.',
            throttling: {
                usages: 1,
                duration: 15
            },
            clientPermissions: ['ATTACH_FILES'],
            args: [
                {
                    key: 'user',
                    prompt: 'Which user would you like to edit the avatar of?',
                    type: 'user',
                    default: ''
                }
            ]
        });
    }

    async run(msg, args) {
        const user = args.user || msg.author;
        const avatarURL = user.avatarURL('png', 512);
        if (!avatarURL) return msg.say('The User Provided has No Avatar.');
        const Image = Canvas.Image;
        Canvas.registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'OpenSans.ttf'), { family: 'Open Sans' }); // eslint-disable-line max-len
        const canvas = new Canvas(494, 568);
        const ctx = canvas.getContext('2d');
        const base = new Image();
        const avatar = new Image();
        const generate = () => {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, 494, 568);
            ctx.drawImage(avatar, 25, 25, 450, 450);
            ctx.drawImage(base, 0, 0);
            ctx.font = '30px Open Sans';
            ctx.fillText(user.username, 35, 48);
        };
        base.src = await fs.readFileAsync(path.join(__dirname, '..', '..', 'assets', 'images', 'steam-card.png'));
        const { body } = await snekfetch.get(avatarURL);
        avatar.src = body;
        generate();
        return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'steam.png' }] });
    }
};
