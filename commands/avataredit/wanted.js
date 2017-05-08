const { Command } = require('discord.js-commando');
const Jimp = require('jimp');

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
        let images = [];
        images.push(Jimp.read(avatarURL));
        images.push(Jimp.read('https://i.imgur.com/ca09TG5.jpg'));
        const [avatar, wanted] = await Promise.all(images);
        avatar.resize(500, 500);
        wanted.composite(avatar, 189, 438);
        wanted.getBuffer(Jimp.MIME_PNG, (err, buff) => {
            if (err) return msg.say(`An Error Occurred: ${err}`);
            return msg.channel.send({ files: [{ attachment: buff, name: 'wanted.png' }] })
                .catch (err => msg.say(`An Error Occurred: ${err}`));
        });
    }
};
