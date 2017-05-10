const { Command } = require('discord.js-commando');
const Canvas = require('canvas');
const request = require('superagent');

module.exports = class TriggeredCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'triggered',
            group: 'avataredit',
            memberName: 'triggered',
            description: 'Put an avatar on a "Triggered" sign.',
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
            const canvas = new Canvas(320, 371);
            const ctx = canvas.getContext('2d');
            const base = new Image();
            const avatar = new Image();
            const generate = () => {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, 320, 371);
                ctx.drawImage(avatar, 0, 0, 320, 320);
                ctx.drawImage(base, 0, 0);
            };
            const triggeredImg = await request
                .get('https://i.imgur.com/tF9yF62.png');
            const avatarImg = await request
                .get(avatarURL);
            base.src = triggeredImg.body;
            avatar.src = avatarImg.body;
            generate();
            return msg.channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'triggered.png' }] })
                .catch(err => msg.say(err));
        } catch (err) {
            return msg.say('An Error Occurred while creating the image.');
        }
    }
};
