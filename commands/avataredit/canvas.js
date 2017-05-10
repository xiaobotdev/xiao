const { Command } = require('discord.js-commando');
const Canvas = require('canvas');
const request = require('superagent');

module.exports = class CanvasCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'canvas',
            group: 'avataredit',
            memberName: 'canvas',
            description: 'Test for node-canvas',
            args: [
                {
                    key: 'user',
                    prompt: 'Which user would you like to edit the avatar of?',
                    type: 'user'
                }
            ]
        });
    }
    
    hasPermission(msg) {
        return this.client.isOwner(msg.author);
    }

    async run(msg, args) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('ATTACH_FILES'))
                return msg.say('This Command requires the `Attach Files` Permission.');
        const { user } = args;
        const avatarURL = user.avatarURL('png', 2048);
        if (!avatarURL) return msg.say('This user has no avatar.');
        const Image = Canvas.Image;
        const canvas = new Canvas(507, 338);
        const ctx = canvas.getContext('2d');
        const base = new Image();
        const avatar = new Image();
        const generate = () => {
            ctx.drawImage(base, 0, 0);
            ctx.drawImage(avatar, 158, 51, 200, 200);
            const imgData = ctx.getImageData(158, 51, 200, 200);
            const data = imgData.data;
            for(let i = 0; i < data.length; i += 4) {
                const brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
                data[i] = brightness;
                data[i + 1] = brightness;
                data[i + 2] = brightness;
            }
            ctx.putImageData(imgData, 158, 51);
        };
        const ripImg = await request
            .get('https://i.imgur.com/Gbu1B2m.png');
        const avatarImg = await request
            .get(avatarURL);
        base.src = ripImg.body;
        avatar.src = avatarImg.body;
        generate();
        return msg.channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'rip.png' }] })
            .catch(err => msg.say(err));
    }
};
