const Command = require('../../structures/Command');
const Canvas = require('canvas');
const snekfetch = require('snekfetch');
const { promisifyAll } = require('tsubaki');
const fs = promisifyAll(require('fs'));
const path = require('path');

module.exports = class BobRossCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bob-ross',
            aliases: ['ross'],
            group: 'avatar-edit',
            memberName: 'bob-ross',
            description: 'Draws a user\'s avatar over Bob Ross\' canvas.',
            throttling: {
                usages: 1,
                duration: 30
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
        const avatarURL = user.displayAvatarURL({
            format: 'png',
            size: 256
        });
        const Image = Canvas.Image;
        const canvas = new Canvas(600, 775);
        const ctx = canvas.getContext('2d');
        const base = new Image();
        const avatar = new Image();
        const generate = () => {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, 600, 775);
            ctx.rotate(3 * Math.PI / 180);
            ctx.drawImage(avatar, 69, 102, 256, 256);
            ctx.rotate(-3 * Math.PI / 180);
            ctx.drawImage(base, 0, 0);
        };
        base.src = await fs.readFileAsync(path.join(__dirname, '..', '..', 'assets', 'images', 'bob-ross.png'));
        const { body } = await snekfetch.get(avatarURL);
        avatar.src = body;
        generate();
        return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'bob-ross.png' }] });
    }
};
