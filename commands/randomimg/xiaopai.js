const { Command } = require('discord.js-commando');
const xiaos = require('../../assets/json/xiaopai');

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
        const xiao = xiaos[Math.floor(Math.random() * xiaos.length)];
        return msg.channel.send({ files: [xiao] })
            .catch(err => msg.say(err));
    }
};
