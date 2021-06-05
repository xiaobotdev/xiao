const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { Readable } = require('stream');
const { reactIfAble, list } = require('../../util/Util');
const accents = require('../../assets/json/tts');
const { LOADING_EMOJI_ID } = process.env;

module.exports = class TtsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tts',
			aliases: ['text-to-speech'],
			group: 'voice',
			memberName: 'tts',
			description: 'Say the text you provide in the accent you choose.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 10
			},
			userPermissions: ['CONNECT', 'SPEAK'],
			credit: [
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Translate TTS API'
				}
			],
			args: [
				{
					key: 'accent',
					prompt: `What accent do you want to use? Either ${list(accents, 'or')}.`,
					type: 'string',
					oneOf: accents,
					parse: accent => accent.toUpperCase()
				},
				{
					key: 'text',
					prompt: 'What text do you want to say?',
					type: 'string',
					max: 200
				}
			]
		});
	}

	async run(msg, { accent, text }) {
		const connection = this.client.voice.connections.get(msg.guild.id);
		if (!connection) {
			const usage = this.client.registry.commands.get('join').usage();
			return msg.reply(`I am not in a voice channel. Use ${usage} to fix that!`);
		}
		if (this.client.dispatchers.has(msg.guild.id)) return msg.reply('I am already playing audio in this server.');
		try {
			await reactIfAble(msg, this.client.user, LOADING_EMOJI_ID, '💬');
			const { body } = await request
				.get('https://translate.google.com/translate_tts')
				.query({
					ie: 'UTF-8',
					q: text,
					tl: accent === 'JP' ? 'ja-JP' : `en-${accent}`,
					total: 1,
					idx: 0,
					textlen: text.length,
					client: 'tw-ob',
					prev: 'input',
					ttsspeed: 1
				});
			const dispatcher = connection.play(Readable.from([body]));
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
