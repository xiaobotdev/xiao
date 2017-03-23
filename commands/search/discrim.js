const commando = require('discord.js-commando');
const Discord = require('discord.js');

module.exports = class DiscrimCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'discrim',
            aliases: [
                'discriminator',
                'searchdiscrim'
            ],
            group: 'search',
            memberName: 'discrim',
            description: 'Searches the server for a certain discriminator. (;discrim 8081)',
            examples: [';discrim 8081']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log("[Command] " + message.content);
        let userToSearch = message.content.split(" ").slice(1).join(" ");
        if (userToSearch.match(/^[0-9]+$/) && userToSearch.split("").length === 4) {
            let users = this.client.users.filter(u => u.discriminator === userToSearch).map(u => u.username).sort();
            const embed = new Discord.RichEmbed()
                .setTitle(users.length + ' Users with the discriminator: ' + userToSearch)
                .setDescription(users.join(', '));
            message.channel.sendEmbed(embed).catch(console.error);
        }
        else {
            message.channel.send(':x: Error! This discriminator is invalid!');
        }
    }
};
