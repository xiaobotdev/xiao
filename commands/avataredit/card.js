const Command = require('../../structures/Command');
const Canvas = require('canvas');
const snekfetch = require('snekfetch');
const moment = require('moment');
const { promisifyAll } = require('tsubaki');
const fs = promisifyAll(require('fs'));
const path = require('path');
const { version } = require('../../package');

module.exports = class CardCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'card',
            aliases: ['discord-card'],
            group: 'avataredit',
            memberName: 'card',
            description: 'Creates a Profile Card for the User.',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 15
            },
            clientPermissions: ['ATTACH_FILES'],
            args: [
                {
                    key: 'member',
                    prompt: 'Which user would you like to edit the avatar of?',
                    type: 'member',
                    default: ''
                }
            ]
        });
    }

    async run(msg, args) {
        const member = args.member || msg.member;
        const avatarURL = member.user.avatarURL('png', 256);
        if (!avatarURL) return msg.say('The User Provided has No Avatar.');
        const cardID = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
        let rarity;
        if (cardID < 5000) rarity = 'C';
        else if (cardID < 8000) rarity = 'U';
        else rarity = 'R';
        const Image = Canvas.Image;
        Canvas.registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'OpenSans.ttf'), { family: 'Open Sans' }); // eslint-disable-line max-len
        const canvas = new Canvas(390, 544);
        const ctx = canvas.getContext('2d');
        const base = new Image();
        const avatar = new Image();
        const generate = () => {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, 390, 544);
            ctx.drawImage(avatar, 11, 11, 370, 370);
            ctx.drawImage(base, 0, 0);
            ctx.font = '18px Open Sans';
            ctx.fillStyle = 'black';
            ctx.fillText(member.displayName, 30, 62);
            ctx.fillText('Discord Join Date:', 148, 400);
            ctx.fillText(moment(member.user.createdTimestamp).format('MMMM Do YYYY'), 148, 420);
            ctx.fillText('Role:', 148, 457);
            ctx.fillText(member.highestRole.name, 148, 477);
            ctx.fillText(rarity, 73, 411);
            ctx.fillText(cardID, 60, 457);
            ctx.fillText(version.split('.')[0], 68, 502);
            ctx.font = '14px Open Sans';
            ctx.fillText(member.id, 30, 355);
            ctx.fillText(`#${member.user.discriminator}`, 313, 355);
        };
        base.src = await fs.readFileAsync(path.join(__dirname, '..', '..', 'assets', 'images', 'card.png'));
        const { body } = await snekfetch.get(avatarURL);
        avatar.src = body;
        generate();
        return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'card.png' }] });
    }
};
