const commando = require('discord.js-commando');
const banlist = require('./banlist.json');
const config = require('../../config.json');

module.exports = class ContactCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'contact',
            aliases: [
                'suggest',
                'report',
                'bug'
            ],
            group: 'botinfo',
            memberName: 'contact',
            description: 'Report bugs or request new features. (;contact Fix this command!)',
            examples: [';contact Fix this command!']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let banID = message.author.id;
        let messageToReport = message.content.split(" ").slice(1).join(" ");
        if (message.author.id === banlist.banned[banID]) {
            let banError = await message.channel.send("Sorry, you've been banned from using this command.");
        }
        else {
            if (!messageToReport) {
                let blankError = await message.channel.send(':x: Error! Please do not report nothing!');
            }
            else {
                let errorRepoty = await this.client.users.get(config.owner).send(`**${message.author.username}#${message.author.discriminator} (${message.author.id}):**\n${messageToReport}`);
                let successMes = await message.channel.send('Message Sent! Thanks for your support!');
            }
        }
    }
};
