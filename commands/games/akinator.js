const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { stripIndents } = require('common-tags');
const { verify } = require('../../util/Util');

module.exports = class AkinatorCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'akinator',
			aliases: ['the-web-genie', 'web-genie'],
			group: 'games',
			memberName: 'akinator',
			description: 'Play a game of Akinator.',
			clientPermissions: ['EMBED_LINKS']
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
				if (!data || this.sessions.get(msg.channel.id).step >= 80) break;
				const answers = data.answers.map(answer => answer.answer.toLowerCase());
				answers.push('end');
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
				if (msgs.first().content.toLowerCase() === 'end') break;
				ans = answers.indexOf(msgs.first().content.toLowerCase());
			}
			const guess = await this.finish(msg.channel);
			const embed = new MessageEmbed()
				.setColor(0xF78B26)
				.setTitle(`I'm ${Math.round(guess.proba * 100)}% sure it's...`)
				.setDescription(stripIndents`
					${guess.name}${guess.description ? `\n_${guess.description}_` : ''}
				`)
				.setThumbnail(guess.absolute_picture_path);
			await msg.embed(embed);
			const verification = await verify(msg.channel, msg.author);
			this.sessions.delete(msg.channel.id);
			if (!verification) return msg.say('Bravo, you have defeated me.');
			return msg.say('Guessed right one more time! I love playing with you!');
		} catch (err) {
			this.sessions.delete(msg.channel.id);
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async createSession(channel) {
		const { body } = await snekfetch
			.get('http://api-us1.akinator.com/ws/new_session')
			.query({
				partner: 1,
				player: 'xiaobot'
			});
		const data = body.parameters;
		if (!data) return null;
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
			.get('http://api-us1.akinator.com/ws/answer')
			.query({
				session: session.id,
				signature: session.signature,
				step: session.step,
				answer
			});
		const data = body.parameters;
		if (!data) return null;
		this.sessions.set(channel.id, {
			id: session.id,
			signature: session.signature,
			step: parseInt(data.step, 10),
			progress: parseInt(data.progression, 10)
		});
		return data;
	}

	async finish(channel) {
		const session = this.sessions.get(channel.id);
		const { body } = await snekfetch
			.get('http://api-us1.akinator.com/ws/list')
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
