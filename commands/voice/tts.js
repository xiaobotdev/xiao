const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const request = require('node-superfetch');
const { Readable } = require('stream');
const { reactIfAble } = require('../../util/Util');
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
			userPermissions: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],
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
					type: 'string',
					oneOf: accents,
					parse: accent => accent.toUpperCase()
				},
				{
					key: 'text',
					type: 'string',
					max: 200
				}
			]
		});
	}

	async run(msg, { accent, text }) {
		const connection = this.client.dispatchers.get(msg.guild.id);
		if (!connection) {
			const usage = this.client.registry.commands.get('join').usage();
			return msg.reply(`I am not in a voice channel. Use ${usage} to fix that!`);
		}
		if (!connection.canPlay) return msg.reply('I am already playing audio in this server.');
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
			connection.play(Readable.from([body]));
			await reactIfAble(msg, this.client.user, '🔉');
			return null;
		} catch (err) {
			await reactIfAble(msg, this.client.user, '⚠️');
			throw err;
		}
	}
};
