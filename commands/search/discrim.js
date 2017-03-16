const commando = require('discord.js-commando');
const Discord = require('discord.js');

class DiscrimCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'discrim', 
            group: 'search',
            memberName: 'discrim',
            description: 'Searches the server for a certain discriminator. (;discrim 8081)',
            examples: [';discrim 8081']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return;
        }
        console.log("[Command] " + message.content);
        let userToSearch = message.content.split(" ").slice(1).join(" ");
        if(userToSearch.match(/^[0-9]+$/) && userToSearch.split("").length === 4) {
            let users = this.client.users.filter(u => u.discriminator === userToSearch).map(u => u.username).sort();
            const embed = new Discord.RichEmbed()
            .setTitle(users.length + ' Users with the discriminator: ' + userToSearch)
            .setDescription(users.join(', '));
            message.channel.sendEmbed(embed).catch(console.error);            
        } else {
            message.channel.send(':x: Error! This discriminator is invalid!');
        }
    }
}

module.exports = DiscrimCommand;