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
            examples: [';romaji ひらがな'],
            args: [{
                key: 'kana',
                prompt: 'What kana would you like to convert to romaji?',
                type: 'string',
                validate: kana => {
                    if (hepburn.containsKana(kana)) {
                        return true;
                    }
                    return 'Please enter text in either Hiragana or Katakana.';
                }
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let romajify = args.kana;
        let romajified = hepburn.fromKana(romajify);
        if (romajified.length > 1950) return message.channel.send(":x: Error! Your message is too long!");
        return message.channel.send(romajified);
    }
};
