const commando = require('discord.js-commando');
const Jimp = require("jimp");

module.exports = class BeautifulCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'beautiful',
			aliases: [
				'grunklestan'
			],
            group: 'avataredit',
            memberName: 'beautiful',
            description: 'Oh, this? This is beautiful. (;beautiful @User)',
            examples: [';beautiful @User']
        });
    }

    async run(message) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'ATTACH_FILES'])) return;
        }
        console.log("[Command] " + message.content);
        if (message.mentions.users.size !== 1) {
            message.channel.send(':x: Error! Please mention one user!');
        } else {
            if(message.mentions.users.first().avatarURL === null) {
                message.channel.send(":x: Error! This user has no avatar!");
            } else {
                let userAvatar = message.mentions.users.first().avatarURL;
                userAvatar = userAvatar.replace(".jpg", ".png");
                userAvatar = userAvatar.replace(".gif", ".png");
                let images = [];
                images.push(Jimp.read(userAvatar));
                images.push(Jimp.read("./images/beautiful.jpg"));
                Promise.all(images).then(([avatar, beautiful]) => {
                    avatar.resize(200, 200);
                    beautiful.blit(avatar, 432, 42);
                    avatar.resize(190, 190);
                    beautiful.blit(avatar, 451, 434);
                    beautiful.getBuffer(Jimp.MIME_PNG, (err, buff) => {
                        if (err) throw err;
                        message.channel.sendFile(buff);
                    });
                });
            }
        }
    }
};