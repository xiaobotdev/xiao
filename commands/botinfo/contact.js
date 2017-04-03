const commando = require('discord.js-commando');
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
            examples: [';contact Fix this command!'],
            args: [{
                key: 'report',
                prompt: 'What would you like to report?',
                type: 'string'
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        const messageToReport = args.report;
        const reportedMsg = await this.client.users.get(config.owner).send(`**${message.author.username}#${message.author.discriminator} (${message.author.id}):**\n${messageToReport}`);
        const successMsg = await message.say('Message Sent! Thanks for your support!');
        return [reportedMsg, successMsg];
    }
};
