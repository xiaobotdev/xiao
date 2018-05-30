const Command = require('../../structures/Command');
const fs = require('fs');
const path = require('path');
const sounds = fs.readdirSync(path.join(__dirname, '..', '..', 'assets', 'sounds', 'airhorn'));

module.exports = class AirhornCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'airhorn',
			group: 'voice',
			memberName: 'airhorn',
			description: 'Plays an airhorn sound in your voice channel.',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 10
			}
		});
	}

	async run(msg) {
		const channel = msg.member.voiceChannel;
		if (!channel) return msg.reply('Please enter a voice channel first.');
		if (!channel.permissionsFor(this.client.user).has(['CONNECT', 'SPEAK'])) {
			return msg.reply('Missing the "Connect" or "Speak" permission for the voice channel.');
		}
		if (!channel.joinable) return msg.reply('Your voice channel is not joinable.');
		if (this.client.voiceConnections.has(channel.guild.id)) return msg.reply('I am already playing a sound.');
		try {
			const connection = await channel.join();
			const airhorn = sounds[Math.floor(Math.random() * sounds.length)];
			const dispatcher = connection.play(path.join(__dirname, '..', '..', 'assets', 'sounds', 'airhorn', airhorn));
			dispatcher.once('finish', () => channel.leave());
			dispatcher.once('error', () => channel.leave());
			return null;
		} catch (err) {
			channel.leave();
			throw err;
		}
	}
};
