const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { Readable } = require('stream');
const { reactIfAble } = require('../../util/Util');
const { LOADING_EMOJI_ID } = process.env;

module.exports = class TrebekCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'trebek',
			aliases: ['alex-trebek'],
			group: 'voice',
			memberName: 'trebek',
			description: 'Speak text like Alex Trebek.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 30
			},
			userPermissions: ['CONNECT', 'SPEAK'],
			credit: [
				{
					name: 'Uberduck',
					url: 'https://uberduck.ai/',
					reason: 'API',
					reasonURL: 'https://uberduck.ai/#voice=trebek'
				}
			],
			args: [
				{
					key: 'speech',
					label: 'text',
					prompt: 'What text do you want to say?',
					type: 'string',
					max: 500
				}
			]
		});
	}

	async run(msg, { speech }) {
		const connection = this.client.voice.connections.get(msg.guild.id);
		if (!connection) {
			const usage = this.client.registry.commands.get('join').usage();
			return msg.reply(`I am not in a voice channel. Use ${usage} to fix that!`);
		}
		if (this.client.dispatchers.has(msg.guild.id)) return msg.reply('I am already playing audio in this server.');
		try {
			await reactIfAble(msg, this.client.user, LOADING_EMOJI_ID, '💬');
			const { text } = await request
				.post('https://api.uberduck.ai/speak')
				.send({
					voice: 'trebek',
					speech
				});
			const dispatcher = connection.play(Readable.from([Buffer.from(text, 'base64')]));
			this.client.dispatchers.set(msg.guild.id, dispatcher);
			dispatcher.once('finish', () => this.client.dispatchers.delete(msg.guild.id));
			dispatcher.once('error', () => this.client.dispatchers.delete(msg.guild.id));
			await reactIfAble(msg, this.client.user, '🔉');
			return null;
		} catch (err) {
			await reactIfAble(msg, this.client.user, '⚠️');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
