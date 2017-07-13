const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const snekfetch = require('snekfetch');
const path = require('path');

module.exports = class ChallengerCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'challenger',
            group: 'avatar-edit',
            memberName: 'challenger',
            description: 'Draws a user\'s avatar over Super Smash Bros.\'s "Challenger Approaching" screen.',
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
        try {
            const canvas = createCanvas(500, 500);
            const ctx = canvas.getContext('2d');
            const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'challenger.png'));
            const { body } = await snekfetch.get(avatarURL);
            const avatar = await loadImage(body);
            ctx.fillStyle = '#ff0028';
            ctx.fillRect(0, 0, 500, 500);
            ctx.drawImage(avatar, 226, 155, 200, 200);
            ctx.drawImage(base, 0, 0);
            return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'challenger.png' }] });
        } catch (err) {
            return msg.say(`Oh no, the image generation failed: \`${err.message}\`. Try again later!`);
        }
    }
};
