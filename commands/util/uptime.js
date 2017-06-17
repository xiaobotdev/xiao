const Command = require('../../structures/Command');
const moment = require('moment');
require('moment-duration-format');

module.exports = class UptimeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'uptime',
            group: 'util',
            memberName: 'uptime',
            description: 'Responds with how long the bot has been active on this Shard.',
            guarded: true
        });
    }

    run(msg) {
        return msg.say(moment.duration(this.client.uptime).format('d[ days], h[ hours], m[ minutes, and ]s[ seconds]'));
    }
};
