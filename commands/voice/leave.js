const Command = require('../../structures/Command');

module.exports = class LeaveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'leave',
			aliases: ['leave-voice-channel', 'leave-vc', 'leave-voice', 'leave-channel'],
			group: 'voice',
			memberName: 'leave',
			description: 'Leaves the current voice channel.',
			guarded: true,
			userPermissions: ['MOVE_MEMBERS']
		});
	}

	run(msg) {
		const connection = this.client.voice.connections.get(msg.guild.id);
		if (!connection) return msg.say('I am not in a voice channel.');
		connection.channel.leave();
		return msg.reply(`Left **${connection.channel.name}**...`);
	}
};
