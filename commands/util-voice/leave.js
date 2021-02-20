const Command = require('../../structures/Command');

module.exports = class LeaveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'leave',
			aliases: ['leave-voice-channel', 'leave-vc', 'leave-voice', 'leave-channel'],
			group: 'util-voice',
			memberName: 'leave',
			description: 'Leaves the current voice channel.',
			guildOnly: true,
			guarded: true
		});
	}

	run(msg) {
		const connection = this.client.voice.connections.get(msg.guild.id);
		if (!connection) return msg.reply('I am not in a voice channel.');
		if (!connection.channel.members.has(msg.author.id)) {
			return msg.reply('You must be in the voice channel to remove me from it.');
		}
		if (!msg.channel.permissionsFor(msg.author).has('MOVE_MEMBERS') && connection.channel.members.size > 2) {
			return msg.reply('You need the "Move members" permission to remove me from this voice channel.');
		}
		if (this.client.dispatchers.has(msg.guild.id)) {
			const usage = this.client.registry.commands.get('stop').usage();
			return msg.reply(`I am currently playing audio in this server. Please use ${usage} first.`);
		}
		connection.channel.leave();
		return msg.reply(`Left **${connection.channel.name}**...`);
	}
};
