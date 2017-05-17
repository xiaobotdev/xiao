const { Command } = require('discord.js-commando');
const Canvas = require('canvas');
const snekfetch = require('snekfetch');
const { promisifyAll } = require('tsubaki');
const fs = promisifyAll(require('fs'));
const path = require('path');

module.exports = class DexterCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dexter',
            group: 'avataredit',
            memberName: 'dexter',
            description: 'Who\'s that pokemon?',
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
            const canvas = new Canvas(744, 554);
            const ctx = canvas.getContext('2d');
            const base = new Image();
            const avatar = new Image();
            const generate = () => {
                ctx.drawImage(base, 0, 0);
                ctx.rotate(-10 * Math.PI / 180);
                ctx.drawImage(avatar, 234, 244, 225, 225);
                ctx.rotate(10 * Math.PI / 180);
            };
            base.src = await fs.readFileAsync(path.join(__dirname, '..', '..', 'assets', 'images', 'dexter.png'));
            const { body } = await snekfetch.get(avatarURL);
            avatar.src = body;
            generate();
            return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'dexter.png' }] })
                .catch(err => msg.say(`${err.name}: ${err.message}`));
        } catch (err) {
            return msg.say(`${err.name}: ${err.message}`);
        }
    }
};
