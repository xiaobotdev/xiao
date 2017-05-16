const { Command } = require('discord.js-commando');
const Canvas = require('canvas');
const snekfetch = require('snekfetch');
const { promisifyAll } = require('tsubaki');
const fs = promisifyAll(require('fs'));
const path = require('path');

module.exports = class SteamCardCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'steam-card',
            group: 'avataredit',
            memberName: 'steam-card',
            description: 'Put an avatar on a Steam Card.',
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
        const username = msg.guild ? (msg.guild.member(user) ? msg.guild.member(user).displayName : user.username) : user.username;
        const avatarURL = user.avatarURL('png', 512);
        if (!avatarURL) return msg.say('This user has no avatar.');
        try {
            const Image = Canvas.Image;
            Canvas.registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'OpenSans.ttf'), { family: 'Open Sans' });
            const canvas = new Canvas(494, 568);
            const ctx = canvas.getContext('2d');
            const base = new Image();
            const avatar = new Image();
            const generate = () => {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, 494, 568);
                ctx.drawImage(avatar, 25, 25, 450, 450);
                ctx.drawImage(base, 0, 0);
                ctx.font = '30px Open Sans';
			    ctx.fillText(username, 35, 48);
            };
            base.src = await fs.readFileAsync(path.join(__dirname, '..', '..', 'assets', 'images', 'steamcard.png'));
            const { body } = await snekfetch.get(avatarURL);
            avatar.src = body;
            generate();
            return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'card.png' }] })
                .catch(() => msg.say('An Error Occurred while sending the image.'));
        } catch (err) {
            return msg.say('An Error Occurred while creating the image.');
        }
    }
};
