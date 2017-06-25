const Command = require('../../structures/Command');

module.exports = class PortalSendCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'portal-send',
            group: 'random',
            memberName: 'portal-send',
            description: 'Send a message to a random channel that has a portal open.',
            guildOnly: true,
            args: [
                {
                    key: 'message',
                    prompt: 'What message do you want to send?',
                    type: 'string',
                    validate: (message) => {
                        if (message.length > 1500) return 'Message must be under 1500 characters.';
                        else if (!/(discord(\.gg\/|app\.com\/invite\/|\.me\/))/gi.test(message)) return true;
                        else return 'Please do not send invites.';
                    }
                }
            ]
        });
    }

    async run(msg, args) {
        const { message } = args;
        const channel = this.client.channels.filter((c) => {
            if (c.type !== 'text') return false;
            else if (!c.topic || !c.permissionsFor(this.client.user).has('SEND_MESSAGES')) return false;
            else if (msg.guild.id === c.guild.id) return false;
            else if (c.topic.includes('<portal>')) return true;
            else return false;
        }).random();
        if (!channel) return msg.say('Aww... No channel has an open portal...');
        try {
            await channel.send(`**${msg.author.tag} (${msg.guild.name}):** ${message}`);
            return msg.say(`Message sent to **${channel.guild.name}**!`);
        } catch (err) {
            return msg.say('Failed to send message...');
        }
    }
};
