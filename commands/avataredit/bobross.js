const { Command } = require('discord.js-commando');
const Canvas = require('canvas');
const request = require('superagent');

module.exports = class BobRossCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bob-ross',
            aliases: ['ross'],
            group: 'avataredit',
            memberName: 'bob-ross',
            description: 'Make Bob Ross draw an avatar.',
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
        const avatarURL = user.avatarURL('png', 2048);
        if (!avatarURL) return msg.say('This user has no avatar.');
        try {
            const Image = Canvas.Image;
            const canvas = new Canvas(600, 775);
            const ctx = canvas.getContext('2d');
            const base = new Image();
            const avatar = new Image();
            const generate = () => {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, 600, 775);
                ctx.rotate(3 * Math.PI / 180);
                ctx.drawImage(avatar, 44, 80, 300, 300);
                ctx.rotate(-3 * Math.PI / 180);
                ctx.drawImage(base, 0, 0);
            };
            const rossImg = await request
                .get('https://i.imgur.com/7NSiFLd.png');
            const avatarImg = await request
                .get(avatarURL);
            base.src = rossImg.body;
            avatar.src = avatarImg.body;
            generate();
            return msg.channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'ross.png' }] })
                .catch(err => msg.say(err));
        } catch (err) {
            return msg.say('An Error Occurred while creating the image.');
        }
    }
};
