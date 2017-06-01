const Command = require('../../structures/Command');
const path = require('path');

module.exports = class XiaoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'xiao',
            aliases: ['xiao-pai'],
            group: 'randomimg',
            memberName: 'xiao',
            description: 'Sends a random image of Xiao Pai.',
            clientPermissions: ['ATTACH_FILES']
        });
    }

    run(msg) {
        const xiao = Math.floor(Math.random() * 10) + 1;
        return msg.say({ files: [path.join(__dirname, '..', '..', 'assets', 'images', `xiao${xiao}.png`)] });
    }
};
