const { Command } = require('discord.js-commando');
const Canvas = require('canvas');
const snekfetch = require('snekfetch');

module.exports = class InvertCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'invert',
            group: 'avataredit',
            memberName: 'invert',
            description: 'Invert a user\'s avatar colors.',
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
                const data = imgData.data;
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = 255 - data[i];
                    data[i + 1] = 255 - data[i + 1];
                    data[i + 2] = 255 - data[i + 2];
                }
                ctx.putImageData(imgData, 0, 0);
            };
            const avatarImg = await snekfetch.get(avatarURL);
            avatar.src = avatarImg.body;
            generate();
            return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'invert.png' }] })
                .catch(() => msg.say('An Error Occurred while sending the image.'));
        } catch (err) {
            return msg.say('An Error Occurred while creating the image.');
        }
    }
};
