const commando = require('discord.js-commando');

module.exports = class MotivateCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'motivate',
            aliases: [
                'encourage',
                'justdoit'
            ],
            group: 'response',
            memberName: 'motivate',
            description: 'Motivates someone. (;motivate @User)',
            examples: [';motivate @User']
        });
    }

    async run(message) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log("[Command] " + message.content);
        let userToMotivate = message.content.split(" ").slice(1).join(" ");
        if(userToMotivate === '') {
            message.reply('https://www.youtube.com/watch?v=ZXsQAXx_ao0');
        } else {
            message.channel.send(userToMotivate + ", https://www.youtube.com/watch?v=ZXsQAXx_ao0");
        }
    }
};