const commando = require('discord.js-commando');
const hepburn = require('hepburn');

class RomajiCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'romaji', 
            group: 'textedit',
            memberName: 'romaji',
            description: 'Convert Hiragana and Katakana to Romaji (;romaji ひらがな)',
            examples: [';romaji ひらがな']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let romajify = message.content.split(" ").slice(1).join(" ");
        if(hepburn.containsKana(romajify)) {
            let romajified = hepburn.fromKana(romajify);
            message.channel.sendMessage(romajified, {split:true});
        } else {
            message.channel.sendMessage(":x: Error! Message contains no Kana!\n:notepad_spiral: Note: You cannot use this command on Kanji!");
        }
    }
}

module.exports = RomajiCommand;