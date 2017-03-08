const commando = require('discord.js-commando');

class EmojiCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'emoji', 
            group: 'guildinfo',
            memberName: 'emoji',
            description: "Gives a list of the current server's emoji. (;emoji)",
            examples: [';emoji']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return;
        }
        console.log("[Command] " + message.content);
        if (message.channel.type === 'dm') {
            message.channel.sendMessage(":x: This is a DM!");
        } else {
            message.channel.sendMessage(message.guild.emojis.map(e => e).join(" "));
        }
    }
}

module.exports = EmojiCommand;