const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class InviteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'invite',
            group: 'util',
            memberName: 'invite',
            description: 'Sends you an invite for the bot and an invite to my server.',
            guarded: true
        });
    }

    async run(msg) {
        const invite = await this.client.generateInvite('1345846343');
        return msg.say(stripIndents`
            Add me to your server with this link:
            <${invite}>
            Or, come to my server with this link:
            ${this.client.options.invite}
        `);
    }
};
