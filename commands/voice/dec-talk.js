const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { Readable } = require('stream');
const { reactIfAble } = require('../../util/Util');
const { LOADING_EMOJI_ID } = process.env;

module.exports = class DECTalkCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dec-talk',
			aliases: ['text-to-speech', 'tts'],
			group: 'voice',
			memberName: 'dec-talk',
			description: 'The world\'s best Text-to-Speech.',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 10
			},
			userPermissions: ['CONNECT', 'SPEAK'],
			credit: [
				{
					name: 'calzoneman',
					url: 'https://github.com/calzoneman',
					reason: 'API',
					reasonURL: 'https://github.com/calzoneman/aeiou'
				},
				{
					name: 'Digital Equipment Corporation',
					url: 'http://gordonbell.azurewebsites.net/digital/timeline/tmlnhome.htm',
					reason: 'Original DECTalk Software'
				},
				{
					name: 'NASA',
					url: 'https://www.nasa.gov/',
					reason: 'Original "Moonbase Alpha" Game',
					reasonURL: 'https://store.steampowered.com/app/39000/Moonbase_Alpha/'
				}
			],
			args: [
				{
					key: 'text',
					prompt: 'What text do you want to say?',
					type: 'string',
					max: 1024
				}
			]
		});
	}

	async run(msg, { text }) {
		const connection = this.client.voice.connections.get(msg.guild.id);
		if (!connection) {
			const usage = this.client.registry.commands.get('join').usage();
			return msg.reply(`I am not in a voice channel. Use ${usage} to fix that!`);
		}
		try {
			await reactIfAble(msg, this.client.user, LOADING_EMOJI_ID, '💬');
			const { body } = await request
				.get('http://tts.cyzon.us/tts')
				.query({ text });
			connection.play(Readable.from([body]));
			await reactIfAble(msg, this.client.user, '🔉');
			return null;
		} catch (err) {
			await reactIfAble(msg, this.client.user, '⚠️');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
