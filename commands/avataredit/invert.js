const Command = require('../../structures/Command');
const Canvas = require('canvas');
const snekfetch = require('snekfetch');

module.exports = class InvertCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'invert',
            group: 'avataredit',
            memberName: 'invert',
            description: 'Invert a user\'s avatar colors.',
            throttling: {
                usages: 1,
                duration: 15
            },
            clientPermissions: ['ATTACH_FILES'],
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
        const { user } = args;
        const avatarURL = user.avatarURL('png', 256);
        if (!avatarURL) return msg.say('This user has no avatar.');
        try {
            const Image = Canvas.Image;
            const canvas = new Canvas(256, 256);
            const ctx = canvas.getContext('2d');
            const avatar = new Image();
            const generate = () => {
                ctx.drawImage(avatar, 0, 0, 256, 256);
                const imgData = ctx.getImageData(0, 0, 256, 256);
                const { data } = imgData;
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = 255 - data[i];
                    data[i + 1] = 255 - data[i + 1];
                    data[i + 2] = 255 - data[i + 2];
                }
                ctx.putImageData(imgData, 0, 0);
            };
            const { body } = await snekfetch.get(avatarURL);
            avatar.src = body;
            generate();
            return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'invert.png' }] })
                .catch(err => msg.say(`${err.name}: ${err.message}`));
        } catch (err) {
            return msg.say(`${err.name}: ${err.message}`);
        }
    }
};
