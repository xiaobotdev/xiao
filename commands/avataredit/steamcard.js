const commando = require('discord.js-commando');
const Jimp = require("jimp");

module.exports = class SteamCardCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'steamcard',
            aliases: [
                'card'
            ],
            group: 'avataredit',
            memberName: 'steamcard',
            description: "Put an avatar on a Steam Card. (;steamcard @User)",
            examples: [';steamcard @user']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'ATTACH_FILES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        if (message.channel.type !== 'dm') {
            if (message.mentions.users.size !== 1) {
                message.channel.send(':x: Error! Please mention one user!');
            }
            else {
                if (!message.mentions.users.first().avatarURL) {
                    message.channel.send(":x: Error! This user has no avatar!");
                }
                else {
                    let userDisplayName = message.guild.member(message.mentions.users.first()).displayName;
                    let userAvatar = message.mentions.users.first().avatarURL;
                    userAvatar = userAvatar.replace(".jpg", ".png");
                    userAvatar = userAvatar.replace(".gif", ".png");
                    let images = [];
                    images.push(Jimp.read(userAvatar));
                    images.push(Jimp.read("./images/SteamCard.png"));
                    images.push(Jimp.read("./images/SteamCardBlank.png"));
                    let [avatar, steamcard, nothing] = await Promise.all(images);
                    let font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
                    avatar.resize(450, 450);
                    nothing.composite(avatar, 25, 25);
                    nothing.composite(steamcard, 0, 0);
                    nothing.print(font, 38, 20, userDisplayName);
                    nothing.getBuffer(Jimp.MIME_PNG, (err, buff) => {
                        if (err) throw err;
                        return message.channel.sendFile(buff);
                    });
                }
            }
        }
        else {
            message.channel.send(':x: Error! This command does not work in DM!');
        }
    }
};
