const commando = require('discord.js-commando');

module.exports = class ReverseCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'reverse',
            group: 'textedit',
            memberName: 'reverse',
            description: 'Reverses text (;reverse This text please)',
            examples: [';reverse This text please']
        });
    }

    async run(message) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log("[Command] " + message.content);
        let stringToReverse = message.content.split(" ").slice(1).join(" ");
        if(stringToReverse === "") {
            message.channel.send(":x: Error! Nothing to reverse!");
        } else {
            let reversed = stringToReverse.split("").reverse().join("");
            message.channel.send(reversed);
        }
    }
};