const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { Readable } = require('stream');
const { list, reactIfAble } = require('../../util/Util');
const voices = require('../../assets/json/vocodes');
const { LOADING_EMOJI_ID } = process.env;

module.exports = class VocodesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'vocodes',
			aliases: ['vocode'],
			group: 'voice',
			memberName: 'vocodes',
			description: 'Speak text like a variety of famous figures.',
			details: `**Voices:** ${Object.keys(voices).join(', ')}`,
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 30
			},
			userPermissions: ['CONNECT', 'SPEAK'],
			credit: [
				{
					name: 'Vocodes',
					url: 'https://vo.codes/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'voice',
					prompt: `What voice do you want to use? Either ${list(Object.keys(voices), 'or')}.`,
					type: 'string',
					oneOf: Object.keys(voices),
					parse: voice => voices[voice.toLowerCase()]
				},
				{
					key: 'text',
					prompt: 'What text do you want to say?',
					type: 'string',
					max: 500
				}
			]
		});
	}

	async run(msg, { voice, text }) {
		const connection = this.client.voice.connections.get(msg.guild.id);
		if (!connection) {
			const usage = this.client.registry.commands.get('join').usage();
			return msg.reply(`I am not in a voice channel. Use ${usage} to fix that!`);
		}
		if (this.client.dispatchers.has(msg.guild.id)) return msg.reply('I am already playing audio in this server.');
		try {
			await reactIfAble(msg, this.client.user, LOADING_EMOJI_ID, '💬');
			const { body } = await request
				.post('https://mumble.stream/speak_spectrogram')
				.send({
					speaker: voice,
					text
				});
			const dispatcher = connection.play(Readable.from([Buffer.from(body.audio_base64, 'base64')]));
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
