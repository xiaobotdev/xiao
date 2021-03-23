const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const { stripIndents } = require('common-tags');
const { shuffle, randomRange, formatTime } = require('../../util/Util');
const { drawImageWithTint } = require('../../util/Canvas');
const horses = require('../../assets/json/horse-race');
const colors = ['gold', 'silver', '#cd7f32'];

module.exports = class HorseRaceCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'horse-race',
			aliases: ['kentucky-derby'],
			group: 'games-sp',
			memberName: 'horse-race',
			description: 'Bet on the fastest horse in a 6-horse race.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Ambition',
					url: 'https://ambition.com/',
					reason: 'Image',
					// eslint-disable-next-line max-len
					reasonURL: 'https://help.ambition.com/hc/en-us/articles/360005048011-How-do-I-set-up-a-Leaderboard-Slide-'
				},
				{
					name: 'Free SVG',
					url: 'https://freesvg.org/',
					reason: 'Image',
					reasonURL: 'https://freesvg.org/race-horse'
				},
				{
					name: 'Iconian Fonts',
					url: 'https://www.fontspace.com/iconian-fonts',
					reason: 'Paladins Font',
					reasonURL: 'https://www.fontspace.com/paladins-font-f32777'
				},
				{
					name: 'Stadium Talk',
					url: 'https://www.stadiumtalk.com/',
					reason: 'Horse Name Data',
					reasonURL: 'https://www.stadiumtalk.com/s/best-racehorse-names-be7b8ad6b49a42df'
				},
				{
					name: 'LoveToKnow',
					url: 'https://www.lovetoknow.com/',
					reason: 'Horse Name Data',
					reasonURL: 'https://horses.lovetoknow.com/horse-names/funny-horse-names'
				}
			]
		});
	}

	async run(msg) {
		const chosenHorses = shuffle(horses).slice(0, 6);
		await msg.reply(stripIndents`
			**Choose a horse to bet on:** _(Type the number)_
			${chosenHorses.map((horse, i) => `**${i + 1}.** ${horse.name}`).join('\n')}
		`);
		const filter = res => {
			if (res.author.id !== msg.author.id) return false;
			const num = Number.parseInt(res.content, 10);
			if (!num) return false;
			return num > 0 && num <= chosenHorses.length;
		};
		const msgs = await msg.channel.awaitMessages(filter, {
			max: 1,
			time: 30000
		});
		if (!msgs.size) return msg.reply('Sorry, can\'t have a race with no bets!');
		const pick = chosenHorses[Number.parseInt(msgs.first().content, 10) - 1];
		let results = [];
		for (const horse of chosenHorses) {
			results.push({
				name: horse.name,
				time: randomRange(horse.minTime, horse.minTime + 5) + Math.random()
			});
		}
		results = results.sort((a, b) => a.time - b.time);
		const leaderboard = await this.generateLeaderboard(chosenHorses, results);
		const win = results[0].name === pick.name;
		return msg.reply(win ? `Nice job! Your horse won!` : 'Better luck next time!', { files: [leaderboard] });
	}

	async generateLeaderboard(chosenHorses, results) {
		const lb = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'horse-race', 'leaderboard.png'));
		const horseImg = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'horse-race', 'horse.png'));
		const canvas = createCanvas(lb.width, lb.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(lb, 0, 0);
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		for (let i = 0; i < results.length; i++) {
			const result = results[i];
			const horse = chosenHorses.find(hor => hor.name === result.name);
			if (colors[i]) drawImageWithTint(ctx, horseImg, colors[i], 37, 114 + (49 * i), 49, 49);
			ctx.font = this.client.fonts.get('Paladins.otf').toCanvasString(34);
			ctx.fillText(formatTime(result.time), 755, 138 + (49 * i));
			ctx.font = this.client.fonts.get('Paladins.otf').toCanvasString(15);
			ctx.fillText(horse.name, 251, 138 + (49 * i));
		}
		return { attachment: canvas.toBuffer(), name: 'leaderboard.png' };
	}
};
