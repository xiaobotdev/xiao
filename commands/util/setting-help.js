const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class SettingHelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'setting-help',
            group: 'util',
            memberName: 'setting-help',
            description: 'View help on how to set up settings.',
            guarded: true
        });
    }

    run(msg) {
        return msg.say(stripIndents`
            **Invite Guard:** Place \`<inviteguard>\` in your default channel's topic. (${msg.guild.defaultChannel})
            **Mod Log Channel:** Place \`<modlog>\` in a channel's topic.
            **Portal Channel:** Place \`<portal>\` in a channel's topic.
            **Member Log Channel:** Place \`<memberlog>\` in a channel's topic.
            **Custom Join Message:** Place \`<joinmessage>message</joinmessage>\` in the Member Log's Channel.
            **Custom Leave Message:** Place \`<leavemessage>message</leavemessage>\` in the Member Log's Channel.
        `);
    }
};
