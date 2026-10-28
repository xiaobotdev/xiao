const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { Readable } = require('stream');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const { writeFile, unlink, readFile } = require('fs/promises');
const path = require('path');
const os = require('os');
const { reactIfAble } = require('../../util/Util');
const { LOADING_EMOJI_ID, DECTALK_PATH } = process.env;

module.exports = class DECTalkCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dec-talk',
			aliases: ['moonbase-alpha', 'dec', 'd-talk'],
			group: 'voice',
			description: 'The world\'s best Text-to-Speech.',
			guildOnly: true,
			sendTyping: false,
			throttling: {
				usages: 2,
				duration: 10
			},
			userPermissions: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],
			credit: [
				{
					name: 'DECTalk',
					url: 'https://github.com/dectalk/dectalk',
					reason: 'DECTalk Software'
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

		this.sayPath = null;
	}

	async run(msg, { text }) {
		if (!DECTALK_PATH || DECTALK_PATH.toLowerCase() === 'off') {
			return msg.reply('My DECTalk engine is currently turned off. Sorry!');
		}
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
		if (!this.sayPath) {
			switch (DECTALK_PATH.toLowerCase()) {
				case 'local':
					this.sayPath = path.join(__dirname, '..', '..', 'dectalk', 'say');
					break;
				case 'localdist':
					this.sayPath = path.join(__dirname, '..', '..', 'dectalk', 'dist', 'say');
					break;
				case 'home':
					this.sayPath = path.join(path.resolve(os.homedir()), 'dectalk', 'say');
					break;
				case 'homedist':
					this.sayPath = path.join(path.resolve(os.homedir()), 'dectalk', 'dist', 'say');
					break;
				default:
					this.sayPath = path.resolve(DECTALK_PATH);
					break;
			}
		}
		const inputFile = path.join(__dirname, '..', '..', 'tmp', 'dec-talk', `${id}.txt`);
		await writeFile(inputFile, input);
		const outputFile = path.join(__dirname, '..', '..', 'tmp', 'dec-talk', `${id}.wav`);
		await execAsync(`${this.sayPath} -pre "[:phoneme on]" -fo ${outputFile} -fi ${inputFile}`, {
			cwd: path.join(path.resolve(this.sayPath), '..'),
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
