const commando = require('discord.js-commando');
const hepburn = require('hepburn');

module.exports = class RomajiCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'romaji',
            aliases: [
                'romajify'
            ],
            group: 'textedit',
            memberName: 'romaji',
            description: 'Convert Hiragana and Katakana to Romaji (;romaji ひらがな)',
            examples: [';romaji ひらがな']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let romajify = message.content.split(" ").slice(1).join(" ");
        if (hepburn.containsKana(romajify)) {
            let romajified = hepburn.fromKana(romajify);
            if (romajified.length > 1950) {
                message.channel.send(":x: Error! Your message is too long!");
            }
            else {
                message.channel.send(romajified);
            }
        }
        else {
            message.channel.send(":x: Error! Message contains no Kana!\n:notepad_spiral: Note: You cannot use this command on Kanji!");
        }
    }
};
