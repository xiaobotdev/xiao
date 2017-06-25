const Command = require('../../structures/Command');

module.exports = class PortalSendCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'portal-send',
            group: 'random',
            memberName: 'portal-send',
            description: 'Send a message to a random channel that has a portal open.',
            args: [
                {
                    key: 'message',
                    prompt: 'What message do you want to send?',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg, args) {
        const { message } = args;
        const channel = this.client.channels.filter((c) => {
            if (!c.topic || !c.permissionsFor(this.client.user).has('SEND_MESSAGES')) return false;
            else if (c.topic.includes('<portal>')) return true;
            else return false;
        }).random();
        if (!channel) return msg.say('Aww... No channel has an open portal...');
        try {
            await channel.send(message);
            return msg.say('Message sent!');
        } catch (err) {
            return msg.say('Failed to send message...');
        }
    }
};
