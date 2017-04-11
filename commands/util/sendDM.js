const commando = require('discord.js-commando');

module.exports = class SendDMCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'senddm',
            aliases: [
                'dm',
                'recontact'
            ],
            group: 'util',
            memberName: 'senddm',
            description: 'Sends a DM to a user ID.',
            examples: [';senddm 278305350804045834 This is a DM.'],
            args: [{
                key: 'userid',
                prompt: 'What is the User ID of the user you wish to contact?',
                type: 'string',
                validate: userID => {
                    if (userID.length === 18) {
                        return true;
                    }
                    return 'Invalid ID.';
                }
            }, {
                key: 'content',
                prompt: 'What would you like the content of the message to be?',
                type: 'string'
            }]
        });
    }
    hasPermission(msg) {
        return this.client.isOwner(msg.author);
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const userID = args.userid;
        const content = args.content;
        try {
            await this.client.users.get(userID).send(content);
            return message.say('Success!');
        }
        catch (err) {
            return message.say(':x: Error! Something went wrong!');
        }
    }
};
