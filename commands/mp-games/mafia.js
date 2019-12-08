const Command = require('../../structures/Command');
const Game = require('../../structures/mafia/Game');
const { verify } = require('../../util/Util');
const storyCount = 21;

module.exports = class MafiaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'mafia',
			group: 'mp-games',
			memberName: 'mafia',
			description: 'Who is the Mafia? Who is the detective? Will the Mafia kill them all?',
			guildOnly: true
		});
	}

	async run(msg) {
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		const voiceChannel = msg.member.voice.channel;
		if (!voiceChannel) return msg.reply('You must be in a voice channel to start a game.');
		for (const member of voiceChannel.members.values()) await msg.guild.members.fetch(member.id);
		if (voiceChannel.members.size > 15) return msg.reply('Please do not have more than 15 players.');
		if (voiceChannel.members.size < 6) return msg.reply('Please have at least 5 players before starting.');
		const game = new Game(this.client, msg.channel, voiceChannel);
		this.client.games.set(msg.channel.id, game);
		try {
			await game.init();
			await game.generate(voiceChannel.members.filter(m => !m.user.bot).map(m => m.user));
			await game.playAudio('init');
			await game.playAudio('rule-ask');
			await msg.say('Type `yes` to hear a rule explanation.');
			const rules = await verify(msg.channel, msg.author);
			if (rules) await game.playAudio('rules');
			while (!game.shouldEnd) {
				let killed = null;
				await game.playAudio(`night-${game.turn}`);
				await game.playAudio('mafia');
				const mafia = game.players.filter(p => p.role === 'mafia');
				const choices = await Promise.all(mafia.map(player => player.dmRound()));
				const randomizer = choices.filter(c => c !== null);
				if (randomizer.length) killed = game.players.get(randomizer[Math.floor(Math.random() * randomizer.length)]);
				await game.playAudio('mafia-decision-made');
				const detective = game.players.find(p => p.role === 'detective');
				if (detective) {
					await game.playAudio('detective');
					await detective.dmRound();
					await game.playAudio('detective-decision-made');
				}
				await game.playAudio(`day-${game.turn}`);
				if (killed) {
					const story = Math.floor(Math.random() * storyCount) + 1;
					await game.playAudio(`story-${story}`);
					await game.playAudio('reveal-deceased');
					await msg.say(`Deceased: **${killed}**`);
					game.players.delete(killed.id);
				} else {
					await game.playAudio('no-deceased');
				}
				await game.playAudio('vote');
				const playersArr = Array.from(game.players.values());
				const votes = await game.getVotes(playersArr);
				if (!votes) {
					await game.playAudio('no-votes');
					continue;
				}
				const hanged = game.getHanged(votes, playersArr);
				await game.playAudio('hanged');
				await msg.say(`Hanged: **${hanged.user}**`);
				game.players.delete(hanged.id);
				++game.turn;
			}
			const mafia = game.players.find(p => p.role === 'mafia');
			if (mafia) await game.playAudio('mafia-wins');
			else await game.playAudio('mafia-loses');
			await game.playAudio('credits');
			game.end();
			return null;
		} catch (err) {
			game.end();
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
