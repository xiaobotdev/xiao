const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');
const { stripIndents } = require('common-tags');
const { upvoters } = require('../../structures/Util');

module.exports = class UpvotersCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'upvoters',
            aliases: ['upvote'],
            group: 'util',
            memberName: 'upvoters',
            description: 'Responds with Xiao\'s upvoters on Discord Bots.',
            guarded: true
        });
    }

    async run(msg) {
        const upvotes = await upvoters(this.client.user.id);
        const { body } = await snekfetch
            .post('https://hastebin.com/documents')
            .send(upvotes.join('\n'));
        return msg.say(stripIndents`
            Upvote Xiao and join ${upvotes.length} others!
            <https://discordbots.org/bot/${this.client.user.id}>
            List of Upvoters: <https://hastebin.com/${body.key}>
        `);
    }
};
