const Command = require('../../structures/Command');
const Canvas = require('canvas');
const snekfetch = require('snekfetch');

module.exports = class GreyscaleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'greyscale',
            aliases: ['grayscale'],
            group: 'avataredit',
            memberName: 'greyscale',
            description: 'Greyscale a user\'s avatar colors.',
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
        const avatarURL = user.avatarURL('png', 256);
        if (!avatarURL) return msg.say('The User Provided has No Avatar.');
        const Image = Canvas.Image;
        const canvas = new Canvas(256, 256);
        const ctx = canvas.getContext('2d');
        const avatar = new Image();
        const generate = () => {
            ctx.drawImage(avatar, 0, 0, 256, 256);
            const imgData = ctx.getImageData(0, 0, 256, 256);
            const { data } = imgData;
            for (let i = 0; i < data.length; i += 4) {
                const brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
                data[i] = brightness;
                data[i + 1] = brightness;
                data[i + 2] = brightness;
            }
            ctx.putImageData(imgData, 0, 0);
        };
        const { body } = await snekfetch.get(avatarURL);
        avatar.src = body;
        generate();
        return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'greyscale.png' }] });
    }
};
