const { Command } = require('discord.js-commando');
const xiaos = require('./xiaos');

module.exports = class XiaoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'xiaopai',
            aliases: [
                'xiao'
            ],
            group: 'randomimg',
            memberName: 'xiaopai',
            description: 'Sends a random image of Xiao Pai.'
        });
    }

    run(message) {
        if (message.channel.type !== 'dm')
            if (!message.channel.permissionsFor(this.client.user).has('ATTACH_FILES'))
                return message.say('This Command requires the `Attach Files` Permission.');
        const xiao = xiaos[Math.floor(Math.random() * xiaos.length)];
        return message.channel.send({files: [xiao]});
    }
};
