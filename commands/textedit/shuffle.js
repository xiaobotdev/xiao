const commando = require('discord.js-commando');

class ShuffleCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'shuffle', 
            group: 'textedit',
            memberName: 'shuffle',
            description: 'Shuffles text (;shuffle This Text)',
            examples: [';shuffle This Text']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        String.prototype.shuffle = function () {
            var a = this.split(""),
            n = a.length;
            for(var i = n - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var tmp = a[i];
                a[i] = a[j];
                a[j] = tmp;
            }
            return a.join("");
        }
        let shuffled = message.content.split(" ").slice(1).join(" ");
        if(shuffled === '') {
            message.channel.send(":x: Error! Nothing to shuffle!");
        } else {
            message.channel.send(shuffled.shuffle());
        }
    }
}

module.exports = ShuffleCommand;