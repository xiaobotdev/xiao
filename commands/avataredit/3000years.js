const commando = require('discord.js-commando');
const Jimp = require("jimp");

class YearsCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: '3000years', 
            group: 'avataredit',
            memberName: '3000years',
            description: "It's been 3000 years... (;3000years @User)",
            examples: [';3000years @user']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('ATTACH_FILES')) return;
        }
        console.log("[Command] " + message.content);
        if (message.mentions.users.size !== 1) {
            message.channel.sendMessage(':x: Either too many or no members, only mention one person!');
        } else {
            if(message.mentions.users.first().avatarURL === null) {
                message.channel.sendMessage(":x: This person has no avatar!");
            } else {
                let avatarurl = message.mentions.users.first().avatarURL;
                avatarurl = avatarurl.replace(".jpg", ".png");
                avatarurl = avatarurl.replace(".gif", ".png");
                let username = message.content.split(" ").slice(1).join(" ");
                message.channel.sendMessage("It's been 3000 years " + username.username + "...");
                let images = [];
                images.push(Jimp.read(avatarurl));
                images.push(Jimp.read("./images/3000years.png"));
                Promise.all(images).then(([avatar, years]) => {
                    avatar.resize(200, 200);
                    years.blit(avatar, 461, 127);
                    years.getBuffer(Jimp.MIME_PNG, (err, buff) => {
                        if (err) throw err;
                        message.channel.sendFile(buff);
                    });
                });
            }
        }
    }
}

module.exports = YearsCommand;