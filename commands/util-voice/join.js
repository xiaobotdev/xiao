const Command = require('../../structures/Command');

module.exports = class JoinCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'join',
			aliases: ['join-voice-channel', 'join-vc', 'join-voice', 'join-channel'],
			group: 'util-voice',
			memberName: 'join',
			description: 'Joins your voice channel.',
			guildOnly: true,
			guarded: true,
			userPermissions: ['CONNECT']
		});
	}

	async run(msg) {
		const voiceChannel = msg.member.voice.channel;
		if (!voiceChannel) return msg.reply('Please enter a voice channel first.');
		if (!voiceChannel.permissionsFor(this.client.user).has(['CONNECT', 'SPEAK', 'VIEW_CHANNEL'])) {
			return msg.reply('I\'m missing the "Connect", "Speak", or "View Channel" permission for this channel.');
		}
		if (!voiceChannel.joinable) return msg.reply('Your voice channel is not joinable.');
		if (this.client.voice.connections.has(voiceChannel.guild.id)) {
			return msg.reply('I am already in a voice channel.');
		}
		await voiceChannel.join();
		return msg.reply(`Joined **${voiceChannel.name}**!`);
	}
};
