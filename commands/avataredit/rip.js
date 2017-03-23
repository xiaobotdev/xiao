const commando = require('discord.js-commando');
const Jimp = require("jimp");

module.exports = class RIPCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'rip',
            aliases: [
                'grave',
                'gravestone'
            ],
            group: 'avataredit',
            memberName: 'rip',
            description: 'Puts a profile picture over a gravestone. (;rip @User)',
            examples: [';rip @User']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'ATTACH_FILES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        if (message.mentions.users.size !== 1) {
            let errorMes1 = await message.channel.send(':x: Error! Please mention one user!');
        }
        else {
            if (!message.mentions.users.first().avatarURL) {
                let errorMes2 = await message.channel.send(":x: Error! This user has no avatar!");
            }
            else {
                let userAvatar = message.mentions.users.first().avatarURL;
                userAvatar = userAvatar.replace(".jpg", ".png");
                userAvatar = userAvatar.replace(".gif", ".png");
                let images = [];
                images.push(Jimp.read(userAvatar));
                images.push(Jimp.read("./images/gravestone.jpg"));
                let [avatar, gravestone] = await Promise.all(images);
                avatar.resize(200, 200);
                gravestone.blit(avatar, 60, 65);
                gravestone.getBuffer(Jimp.MIME_PNG, (err, buff) => {
                    if (err) throw err;
                    message.channel.sendFile(buff);
                });
            }
        }
    }
};
