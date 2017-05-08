const { Command } = require('discord.js-commando');
const xiaos = require('./xiaos');

module.exports = class XiaoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'xiao-pai',
            aliases: ['xiao'],
            group: 'randomimg',
            memberName: 'xiao-pai',
            description: 'Sends a random image of Xiao Pai.'
        });
    }

    run(msg) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('ATTACH_FILES'))
                return msg.say('This Command requires the `Attach Files` Permission.');
        const xiao = xiaos[Math.floor(Math.random() * xiaos.length)];
        return msg.channel.send({ files: [xiao] })
            .catch (err => msg.say(`An Error Occurred: ${err}`));
    }
};
