const commando = require('discord.js-commando');

module.exports = class EmojiCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'emoji',
            aliases: [
                'emoticons',
                'emojilist',
                'emoticonlist'
            ],
            group: 'guildinfo',
            memberName: 'emoji',
            description: 'Gives a list of the current server\'s emoji. (;emoji)',
            examples: [';emoji'],
            guildOnly: true
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        return message.say(message.guild.emojis.map(e => e).join(' '));
    }
};
