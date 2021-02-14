const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class OptionsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'options',
			aliases: ['options-list'],
			group: 'util-public',
			memberName: 'options',
			description: 'Responds with a list of server options.',
			guarded: true
		});
	}

	run(msg) {
		return msg.say(stripIndents`
			__**Server Options**__
			Place the option in the appropriate channel's topic to use.

			__General Options__
			\`<xiao:disable-leave>\` Disables leave messages (System Channel).

			__Phone Options__
			\`<xiao:phone>\` Allows this channel to recieve phone calls.
			\`<xiao:phone:auto-accept>\` Automatically accepts all incoming phone calls.
			\`<xiao:phone:no-notice>\` Hides the abuse notice from phone call pick-ups.
			\`<xiao:phone:no-voicemail>\` Prevents this channel from recieving voicemails for missed calls.
			\`<xiao:phone:no-random>\` Makes the channel only able to be called directly, rather than picked randomly.
			\`<xiao:phone:block:INSERTIDHERE>\` Blocks a channel or server from contacting you via phone.
			\`<xiao:phone-book:hide>\` Hides this channel from \`phone-book\`.

			__Portal Options__
			\`<xiao:portal>\` Marks the channel as a portal channel for \`portal-send\`.
			\`<xiao:portal:hide-name>\` Hides the channel's name when the channel is chosen to recieve a portal message.
		`);
	}
};
