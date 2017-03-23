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
            description: "Gives a list of the current server's emoji. (;emoji)",
            examples: [';emoji']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        if (message.channel.type !== 'dm') {
            let emojiMes = await message.channel.send(message.guild.emojis.map(e => e).join(" "));
        }
        else {
            let errorMessage = await message.channel.send(":x: Error! This command does not work in DM!");
        }
    }
};
