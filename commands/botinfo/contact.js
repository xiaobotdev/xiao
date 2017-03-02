const commando = require('discord.js-commando');
const banlist = require('./banlist.json');

class ContactCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'contact', 
            group: 'botinfo',
            memberName: 'contact',
            description: 'Report bugs or request new features. (;contact Fix this command!)',
            examples: [';contact Fix this command!']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let banid = message.author.id;
        if (message.author.id === banlist.banned[banid]) {
            message.reply("Sorry, you've been banned from using this command.");
        } else {
            this.client.users.get('242699360352206850').sendMessage("**" + message.author.username + '#' + message.author.discriminator + " (" + message.author.id + ")" + ":**\n" + message.content.split(" ").slice(1).join(" "));
            message.reply('Message Sent! Thanks for your support!');
        }
    }
}

module.exports = ContactCommand;