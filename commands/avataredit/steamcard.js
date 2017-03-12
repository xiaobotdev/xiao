const commando = require('discord.js-commando');
const Jimp = require("jimp");

class SteamCardCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'steamcard', 
            group: 'avataredit',
            memberName: 'steamcard',
            description: "Put an avatar on a Steam Card. (;steamcard @User)",
            examples: [';steamcard @user']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('ATTACH_FILES')) return;
        }
        console.log("[Command] " + message.content);
        if(message.channel.type !== 'dm') {
            if (message.mentions.users.size !== 1) {
                message.channel.sendMessage(':x: Either too many or no members, only mention one person!');
            } else {
                if(message.mentions.users.first().avatarURL === null) {
                    message.channel.sendMessage(":x: This person has no avatar!");
                } else {
                    let userdisplayname = message.guild.member(message.mentions.users.first()).displayName;
                    let avatarurl = message.mentions.users.first().avatarURL;
                    avatarurl = avatarurl.replace(".jpg", ".png");
                    avatarurl = avatarurl.replace(".gif", ".png");
                    let images = [];
                    images.push(Jimp.read(avatarurl));
                    images.push(Jimp.read("./images/SteamCard.png"));
                    images.push(Jimp.read("./images/SteamCardBlank.png"));
                    Promise.all(images).then(([avatar, steamcard, nothing]) => {
                        Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then(function (font) {
                            avatar.resize(450, 450);
                            nothing.composite(avatar, 25, 25);
                            nothing.composite(steamcard, 0, 0);
                            nothing.print(font, 38, 20, userdisplayname);
                            nothing.getBuffer(Jimp.MIME_PNG, (err, buff) => {
                                if (err) throw err;
                                message.channel.sendFile(buff);
                            });
                        });
                    });
                }
            }
        } else {
            message.channel.sendMessage(':x: Error! This command does not work in DM!');
        }
    }
}

module.exports = SteamCardCommand;