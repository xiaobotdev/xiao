const commando = require('discord.js-commando');

class SayCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'say', 
            group: 'textedit',
            memberName: 'say',
            description: 'Make XiaoBot say what you wish. (;say I can talk!)',
            examples: [';say I can talk!']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let Copycat = message.content.split(" ").slice(1).join(" ");
        if(Copycat === "") {
            message.channel.send(":x: Error! Nothing to say!");
        } else {
            message.channel.send(Copycat);
            if (message.channel.type === 'dm') return;
            message.delete();
        }
    }
}

module.exports = SayCommand;