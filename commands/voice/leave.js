const Command = require('../../structures/Command');

module.exports = class LeaveVoiceChannelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'leave-voice-channel',
			aliases: ['leave-vc'],
			group: 'voice',
			memberName: 'leave',
			description: 'Leaves a voice channel, in case the bot gets stuck.',
			guildOnly: true,
			userPermissions: ['MOVE_MEMBERS']
		});
	}

	run(msg) {
		if (!this.client.voiceConnections.has(msg.guild.id)) return msg.reply('I am not in a voice channel...');
		const { channel } = this.client.voiceConnections.get(msg.guild.id);
		channel.leave();
		return msg.say(`Left **${channel.name}**.`);
	}
};
