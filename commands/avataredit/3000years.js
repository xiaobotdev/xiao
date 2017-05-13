const { Command } = require('discord.js-commando');
const Canvas = require('canvas');
const request = require('superagent');
const { promisifyAll } = require('tsubaki');
const fs = promisifyAll(require('fs'));
const path = require('path');

module.exports = class YearsCommand extends Command {
    constructor(client) {
        super(client, {
            name: '3000years',
            aliases: ['az'],
            group: 'avataredit',
            memberName: '3000years',
            description: 'It\'s been 3000 years...',
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
            const canvas = new Canvas(856, 569);
            const ctx = canvas.getContext('2d');
            const base = new Image();
            const avatar = new Image();
            const generate = () => {
                ctx.drawImage(base, 0, 0);
                ctx.drawImage(avatar, 461, 127, 200, 200);
            };
            base.src = await fs.readFileAsync(path.join(__dirname, '..', '..', 'assets', 'images', '3000years.png'));
            const { body } = await request.get(avatarURL);
            avatar.src = body;
            generate();
            return msg.channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'az.png' }] })
                .catch(err => msg.say(err));
        } catch (err) {
            return msg.say('An Error Occurred while creating the image.');
        }
    }
};
