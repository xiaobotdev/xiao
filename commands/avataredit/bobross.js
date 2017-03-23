const commando = require('discord.js-commando');
const Jimp = require("jimp");

module.exports = class BobRossCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'bobross',
            aliases: [
                'bob',
                'ross'
            ],
            group: 'avataredit',
            memberName: 'bobross',
            description: "Make Bob Ross draw your avatar. (;bobross @User)",
            examples: [';bobross @User']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'ATTACH_FILES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        if (message.mentions.users.size !== 1) {
            message.channel.send(':x: Error! Please mention one user!');
        }
        else {
            if (!message.mentions.users.first().avatarURL) {
                message.channel.send(":x: Error! This user has no avatar!");
            }
            else {
                let userAvatar = message.mentions.users.first().avatarURL;
                userAvatar = userAvatar.replace(".jpg", ".png");
                userAvatar = userAvatar.replace(".gif", ".png");
                let images = [];
                images.push(Jimp.read(userAvatar));
                images.push(Jimp.read("./images/BobRoss.png"));
                images.push(Jimp.read("./images/BlankWhite.png"));
                Promise.all(images).then(([avatar, bob, nothing]) => {
                    avatar.rotate(2);
                    avatar.resize(300, 300);
                    nothing.composite(avatar, 44, 85);
                    nothing.composite(bob, 0, 0);
                    nothing.getBuffer(Jimp.MIME_PNG, (err, buff) => {
                        if (err) throw err;
                        message.channel.sendFile(buff);
                    });
                });
            }
        }
    }
};
