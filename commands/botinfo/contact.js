const commando = require('discord.js-commando');

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
        const messageToReport = args.report;
        const reportedMsg = await this.client.users.get(process.env.OWNER_ID).send(`**${message.author.username}#${message.author.discriminator} (${message.author.id}):**\n${messageToReport}`);
        const successMsg = await message.say('Message Sent! Thanks for your support!');
        return [reportedMsg, successMsg];
    }
};
