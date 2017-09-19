const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { stripIndents } = require('common-tags');

module.exports = class AkinatorCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'akinator',
			group: 'games',
			memberName: 'akinator',
			description: 'Play a game of Akinator!'
		});

		this.sessions = new Map();
	}

	async run(msg) {
		if (this.sessions.has(msg.channel.id)) return msg.say('Only one game may be occuring per channel.');
		try {
			let ans = null;
			this.sessions.set(msg.channel.id, { progress: null });
			while (this.sessions.get(msg.channel.id).progress < 99) {
				const data = ans === null ? await this.createSession(msg.channel) : await this.progress(msg.channel, ans);
				const answers = data.answers.map(answer => answer.answer.toLowerCase());
				await msg.say(stripIndents`
					**${++data.step}.** ${data.question}
					${data.answers.map(answer => answer.answer).join(' | ')}
				`);
				const filter = res => res.author.id === msg.author.id && answers.includes(res.content.toLowerCase());
				const msgs = await msg.channel.awaitMessages(filter, {
					max: 1,
					time: 30000
				});
				if (!msgs.size) {
					await msg.say('Sorry, time is up!');
					break;
				}
				ans = answers.indexOf(msgs.first().content.toLowerCase());
			}
			const guess = await this.finish(msg.channel);
			const embed = new MessageEmbed()
				.setTitle(`I'm ${Math.round(guess.proba * 100)}% sure it's...`)
				.setDescription(guess.name)
				.setThumbnail(guess.absolute_picture_path);
			await msg.embed(embed);
			const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
				max: 1,
				time: 30000
			});
			this.sessions.delete(msg.channel.id);
			if (!msgs.size) return msg.say('I guess your silence means I have won.');
			const response = msgs.first().content.toLowerCase();
			if (!['yes', 'no'].includes(response)) return msg.say('I guess I\'m right then!');
			return msg.say(response === 'yes' ? 'Another win for me!' : 'Bravo, you have defeated me.');
		} catch (err) {
			this.sessions.delete(msg.channel.id);
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async createSession(channel) {
		const { body } = await snekfetch
			.get('http://api-en1.akinator.com/ws/new_session')
			.query({
				partner: 1,
				player: 'xiaobot'
			});
		const data = body.parameters;
		this.sessions.set(channel.id, {
			id: data.identification.session,
			signature: data.identification.signature,
			step: 0,
			progress: parseInt(data.step_information.progression, 10)
		});
		return data.step_information;
	}

	async progress(channel, answer) {
		const session = this.sessions.get(channel.id);
		const { body } = await snekfetch
			.get('http://api-en1.akinator.com/ws/answer')
			.query({
				session: session.id,
				signature: session.signature,
				step: session.step,
				answer
			});
		this.sessions.set(channel.id, {
			id: session.id,
			signature: session.signature,
			step: parseInt(body.parameters.step, 10),
			progress: parseInt(body.parameters.progression, 10)
		});
		return body.parameters;
	}

	async finish(channel) {
		const session = this.sessions.get(channel.id);
		const { body } = await snekfetch
			.get('http://api-en1.akinator.com/ws/list')
			.query({
				session: session.id,
				signature: session.signature,
				step: session.step,
				size: 1,
				mode_question: 0
			});
		return body.parameters.elements[0].element;
	}
};
