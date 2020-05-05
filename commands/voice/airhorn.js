const Command = require('../../structures/Command');
const path = require('path');
const sounds = require('../../assets/json/airhorn');

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
			clientPermissions: ['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'],
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
		const inGuild = msg.guild ? undefined : null;
		const connection = this.client.voice.connections.get(msg.guild.id);
		if (!connection) {
			return msg.reply(`I am not in a voice channel. Use ${msg.anyUsage('join', inGuild, inGuild)} to fix that!.`);
		}
		const airhorn = sounds[Math.floor(Math.random() * sounds.length)];
		connection.play(path.join(__dirname, '..', '..', 'assets', 'sounds', 'airhorn', airhorn));
		await msg.react('🔉');
		return null;
	}
};
