const Command = require('../../structures/Command');
const Canvas = require('canvas');
const snekfetch = require('snekfetch');
const { promisifyAll } = require('tsubaki');
const fs = promisifyAll(require('fs'));
const path = require('path');

module.exports = class SimbaCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'simba',
            group: 'avataredit',
            memberName: 'simba',
            description: 'Remember who you are...',
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
        const canvas = new Canvas(500, 281);
        const ctx = canvas.getContext('2d');
        const base = new Image();
        const avatar = new Image();
        const generate = () => {
            ctx.drawImage(base, 0, 0);
            ctx.rotate(-24 * Math.PI / 180);
            ctx.drawImage(avatar, 75, 160, 130, 150);
            ctx.rotate(24 * Math.PI / 180);
        };
        base.src = await fs.readFileAsync(path.join(__dirname, '..', '..', 'assets', 'images', 'simba.png'));
        const { body } = await snekfetch.get(avatarURL);
        avatar.src = body;
        generate();
        return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'simba.png' }] });
    }
};
