const Command = require('../../structures/Command');
const xiaos = require('../../assets/json/xiao');

module.exports = class XiaoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'xiao',
            aliases: ['xiao-pai', 'iao'],
            group: 'random-img',
            memberName: 'xiao',
            description: 'Responds with a random image of Xiao Pai.',
            clientPermissions: ['ATTACH_FILES']
        });
    }

    run(msg) {
        const xiao = xiaos[Math.floor(Math.random() * xiaos.length)];
        return msg.say({ files: [xiao] });
    }
};
