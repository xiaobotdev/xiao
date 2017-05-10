const { Command } = require('discord.js-commando');
const Canvas = require('canvas');
const request = require('superagent');
const path = require('path');

module.exports = class SteamCardCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'steam-card',
            aliases: ['card'],
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
        const username = msg.guild ? msg.guild.member(user).displayName : user.username;
        const avatarURL = user.avatarURL('png', 2048);
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
                ctx.font = '32px Open Sans';
			    ctx.fillStyle = 'white';
			    ctx.fillText(username, 30, 50);
            };
            const cardImg = await request
                .get('https://i.imgur.com/JF0WwQX.png');
            const avatarImg = await request
                .get(avatarURL);
            base.src = cardImg.body;
            avatar.src = avatarImg.body;
            generate();
            return msg.channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'card.png' }] })
                .catch(err => msg.say(err));
        } catch (err) {
            return msg.say('An Error Occurred while creating the image.');
        }
    }
};
