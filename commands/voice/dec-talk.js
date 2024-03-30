const Command = require('../../framework/Command');
const { Readable } = require('stream');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const { writeFile, unlink, readFile } = require('fs/promises');
const path = require('path');
const { reactIfAble } = require('../../util/Util');
const { LOADING_EMOJI_ID } = process.env;

module.exports = class DECTalkCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dec-talk',
			aliases: ['moonbase-alpha', 'dec', 'd-talk'],
			group: 'voice',
			memberName: 'dec-talk',
			description: 'The world\'s best Text-to-Speech.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 10
			},
			userPermissions: ['CONNECT', 'SPEAK'],
			credit: [
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
					type: 'string',
					max: 1024
				}
			]
		});
	}

	async run(msg, { text }) {
		const connection = this.client.dispatchers.get(msg.guild.id);
		if (!connection) {
			const usage = this.client.registry.commands.get('join').usage();
			return msg.reply(`I am not in a voice channel. Use ${usage} to fix that!`);
		}
		if (!connection.canPlay) return msg.reply('I am already playing audio in this server.');
		try {
			await reactIfAble(msg, this.client.user, LOADING_EMOJI_ID, '💬');
			const body = await this.tts(msg.guild.id, text);
			connection.play(Readable.from([body]));
			await reactIfAble(msg, this.client.user, '🔉');
			return null;
		} catch (err) {
			await reactIfAble(msg, this.client.user, '⚠️');
			throw err;
		}
	}

	async tts(id, input) {
		const inputFile = path.join(__dirname, '..', '..', 'tmp', 'dec-talk', `${id}.txt`);
		await writeFile(inputFile, input);
		const outputFile = path.join(__dirname, '..', '..', 'tmp', 'dec-talk', `${id}.wav`);
		await execAsync(`xvfb-run wine say.exe -pre "[:phoneme on]" -w ${outputFile} < ${inputFile}`, {
			cwd: path.join(__dirname, '..', '..', 'dectalk'),
			timeout: 30000
		});
		let result;
		try {
			await unlink(inputFile);
			result = await readFile(outputFile);
			await unlink(outputFile);
		} catch {
			if (!result) result = null;
		}
		return result;
	}
};
