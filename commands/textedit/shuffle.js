const commando = require('discord.js-commando');

module.exports = class ShuffleCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'shuffle',
            group: 'textedit',
            memberName: 'shuffle',
            description: 'Shuffles text (;shuffle This Text)',
            examples: [';shuffle This Text']
        });
    }

    async run(message) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log("[Command] " + message.content);
        String.prototype.shuffle = function () {
            let a = this.split(""),
            n = a.length;
            for(let i = n - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                let tmp = a[i];
                a[i] = a[j];
                a[j] = tmp;
            }
            return a.join("");
        };
        let thingToShuffle = message.content.split(" ").slice(1).join(" ");
        if(thingToShuffle === '') {
            message.channel.send(":x: Error! Nothing to shuffle!");
        } else {
            message.channel.send(thingToShuffle.shuffle());
        }
    }
};