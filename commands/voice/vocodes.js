const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { Readable } = require('stream');
const { list } = require('../../util/Util');
const voices = {
	sonic: 'sonic',
	homer: 'homer-simpson',
	spongebob: 'spongebob-squarepants',
	arnold: 'arnold-schwarzenegger'
};

module.exports = class VocodesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'vocodes',
			group: 'voice',
			memberName: 'vocodes',
			description: 'Speak text like a variety of famous figures.',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 10
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
		try {
			const { body } = await request
				.post('https://mumble.stream/speak_spectrogram')
				.send({
					speaker: voice,
					text
				});
			connection.play(Readable.from([Buffer.from(body.audio_base64, 'base64')]));
			if (msg.channel.permissionsFor(this.client.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'])) {
				await msg.react('🔉');
			}
			return null;
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
