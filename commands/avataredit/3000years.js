const { Command } = require('discord.js-commando');
const Jimp = require('jimp');

module.exports = class YearsCommand extends Command {
    constructor(client) {
        super(client, {
            name: '3000years',
            aliases: [
                'az'
            ],
            group: 'avataredit',
            memberName: '3000years',
            description: 'It\'s been 3000 years...',
            args: [{
                key: 'user',
                prompt: 'Which user would you like to edit the avatar of?',
                type: 'user'
            }]
        });
    }

    async run(msg, args) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('ATTACH_FILES')) 
                return msg.say('This Command requires the `Attach Files` Permission.');
        const { user } = args;
        const avatarURL = user.avatarURL('png', 512);
        if (!avatarURL) return msg.say('This user has no avatar.');
        let images = [];
        images.push(Jimp.read(avatarURL));
        images.push(Jimp.read('https://i.imgur.com/eScwGFS.png'));
        const [avatar, az] = await Promise.all(images);
        avatar.resize(200, 200);
        az.composite(avatar, 461, 127);
        az.getBuffer(Jimp.MIME_PNG, (err, buff) => {
            if (err) return msg.say('An Unknown Error Occurred.');
            return msg.channel.send({files: [{attachment: buff}]});
        });
    }
};
