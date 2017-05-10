const { Command } = require('discord.js-commando');
const Canvas = require('canvas');
const request = require('superagent');

module.exports = class WantedCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'wanted',
            group: 'avataredit',
            memberName: 'wanted',
            description: 'Puts an avatar on a wanted poster.',
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
            const canvas = new Canvas(741, 1000);
            const ctx = canvas.getContext('2d');
            const base = new Image();
            const avatar = new Image();
            const generate = () => {
                ctx.drawImage(base, 0, 0);
                ctx.drawImage(avatar, 150, 360, 430, 430);
            };
            const wantedImg = await request
                .get('https://i.imgur.com/6bBDfsO.png');
            const avatarImg = await request
                .get(avatarURL);
            base.src = wantedImg.body;
            avatar.src = avatarImg.body;
            generate();
            return msg.channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'wanted.png' }] })
                .catch(err => msg.say(err));
        } catch (err) {
            return msg.say('An Error Occurred while creating the image.');
        }
    }
};
