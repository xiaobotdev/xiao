const commando = require('discord.js-commando');
const morse = require('morse');

class MorseCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'morse', 
            group: 'textedit',
            memberName: 'morse',
            description: 'Translates text to and from morse code. (;morse encode This is Morse Code.)',
            examples: [';morse encode This is Morse Code.', ';morse decode .... . .-.. .-.. --- --..-- ....... .-- --- .-. .-.. -.. .-.-.-']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let [methodToUse] = message.content.toLowerCase().split(" ").slice(1);
        let toMorse = message.content.split(" ").slice(2).join(" ");
        if(toMorse === "") {
            message.channel.send(":x: Error! Nothing to translate!");
        } else if(methodToUse === 'encode') {
            message.channel.send(morse.encode(toMorse)).catch(error => message.channel.send(':x: Error! Something went wrong! Perhaps you entered incorrect text?'));
        } else if(methodToUse === 'decode') {
            message.channel.send(morse.decode(toMorse)).catch(error => message.channel.send(':x: Error! Something went wrong! Perhaps you entered incorrect text?'));
        } else {
            message.channel.send(":x: Error! Method not set/not correct! Use either encode or decode.");
        }
    }
}

module.exports = MorseCommand;