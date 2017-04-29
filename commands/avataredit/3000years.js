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

    async run(message, args) {
        if (message.channel.type !== 'dm')
            if (!message.channel.permissionsFor(this.client.user).has('ATTACH_FILES')) 
                return message.say('This Command requires the `Attach Files` Permission.');
        const { user } = args;
        const userAvatar = user.displayAvatarURL.replace(/(png|jpg|jpeg|gif|webp)/, 'png');
        let images = [];
        images.push(Jimp.read(userAvatar));
        images.push(Jimp.read('https://i.imgur.com/eScwGFS.png'));
        const [avatar, years] = await Promise.all(images);
        avatar.resize(200, 200);
        years.composite(avatar, 461, 127);
        years.getBuffer(Jimp.MIME_PNG, (err, buff) => {
            if (err) return message.say('An Unknown Error Occurred.');
            return message.channel.send({files: [{attachment: buff}]});
        });
    }
};
