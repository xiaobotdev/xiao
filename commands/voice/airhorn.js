const Command = require('../../structures/Command');
const path = require('path');
const { reactIfAble } = require('../../util/Util');
const fs = require('fs');
const sounds = fs.readdirSync(path.join(__dirname, '..', '..', 'assets', 'sounds', 'airhorn'));

module.exports = class AirhornCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'airhorn',
			group: 'voice',
			memberName: 'airhorn',
			description: 'Plays an airhorn sound in a voice channel.',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 10
			},
			userPermissions: ['CONNECT', 'SPEAK'],
			credit: [
				{
					name: 'Discord',
					url: 'https://discord.com/',
					reason: 'Airhorn Sounds',
					reasonURL: 'https://github.com/discord/airhornbot/tree/master/audio'
				}
			]
		});
	}

	async run(msg) {
		const connection = this.client.voice.connections.get(msg.guild.id);
		if (!connection) {
			const usage = this.client.registry.commands.get('join').usage();
			return msg.reply(`I am not in a voice channel. Use ${usage} to fix that!`);
		}
		if (this.client.dispatchers.has(msg.guild.id)) return msg.reply('I am already playing audio in this server.');
		const airhorn = sounds[Math.floor(Math.random() * sounds.length)];
		const dispatcher = connection.play(path.join(__dirname, '..', '..', 'assets', 'sounds', 'airhorn', airhorn));
		this.client.dispatchers.set(msg.guild.id, dispatcher);
		dispatcher.once('finish', () => this.client.dispatchers.delete(msg.guild.id));
		dispatcher.once('error', () => this.client.dispatchers.delete(msg.guild.id));
		await reactIfAble(msg, this.client.user, '🔉');
		return null;
	}
};
