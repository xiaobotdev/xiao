const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const { stripIndents } = require('common-tags');
const path = require('path');
const { verify, list, randomRange } = require('../../util/Util');
const fs = require('fs');
const cars = fs.readdirSync(path.join(__dirname, '..', '..', 'assets', 'images', 'car-race', 'cars'))
	.map(car => car.replace('.png', ''));
const words = ['go', 'zoom', 'drive', 'advance', 'pedal', 'vroom'];

module.exports = class CarRaceCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'car-race',
			aliases: ['cars'],
			group: 'games-mp',
			memberName: 'car-race',
			description: 'Race a car against another user.',
			credit: [
				{
					name: 'iStock',
					url: 'https://www.istockphoto.com/',
					reason: 'Background Image',
					// eslint-disable-next-line max-len
					reasonURL: 'https://www.istockphoto.com/vector/side-view-of-a-road-with-a-crash-barrier-roadside-green-meadow-and-clear-blue-sky-gm1081596948-290039955'
				},
				{
					name: 'PNGkit',
					url: 'https://www.pngkit.com/',
					reason: 'Earnhardt Car Image',
					reasonURL: 'https://www.pngkit.com/bigpic/u2r5r5o0a9y3w7q8/'
				},
				{
					name: 'Disneyclips.com',
					url: 'https://www.disneyclips.com/main.html',
					reason: 'McQueen Car Image',
					reasonURL: 'https://www.disneyclips.com/images2/cars2.html'
				},
				{
					name: 'NicolasDavila',
					url: 'https://www.deviantart.com/nicolasdavila',
					reason: 'Reverb Car Image',
					reasonURL: 'https://www.deviantart.com/nicolasdavila/art/Reverb-Wireframe-Blueprint-777342814'
				},
				{
					name: 'Sherif Saad',
					url: 'https://www.behance.net/SherifSaad',
					reason: 'AE86 Car Image',
					reasonURL: 'https://www.behance.net/gallery/62672149/AE86-Tattoo'
				},
				{
					name: 'ClipArtBest',
					url: 'http://www.clipartbest.com/',
					reason: 'Kitano Car Image',
					reasonURL: 'http://www.clipartbest.com/clipart-KinXey4XT'
				},
				{
					name: 'Marien Bierhuizen',
					url: 'https://www.racedepartment.com/members/marien-bierhuizen.280739/',
					reason: 'F1 Car Image',
					reasonURL: 'https://www.racedepartment.com/downloads/f2018-car-sideviews.22450/updates'
				},
				{
					name: 'La Linea',
					url: 'https://www.lalinea.de/',
					reason: 'Elise Car Image',
					reasonURL: 'https://www.lalinea.de/pkw/neuwagen/lotus/elise/roadster-2-tuerer/2011/'
				},
				{
					name: 'PNGkey.com',
					url: 'https://www.pngkey.com/',
					reason: 'Sonic Car Image',
					reasonURL: 'https://www.pngkey.com/maxpic/u2e6y3t4a9o0a9a9/'
				},
				{
					name: 'MinionFan1024',
					url: 'https://www.deviantart.com/minionfan1024',
					reason: 'Anakin Car Image',
					reasonURL: 'https://www.deviantart.com/minionfan1024/art/Anakin-s-podracer-829694073'
				},
				{
					name: 'theraymachine',
					url: 'https://www.gran-turismo.com/ch/gtsport/user/profile/1679092/overview',
					reason: 'DeLorean Car Image',
					// eslint-disable-next-line max-len
					reasonURL: 'https://www.gran-turismo.com/ch/gtsport/user/profile/1679092/gallery/all/decal/1679092/7359459034929333784'
				},
				{
					name: 'Kevin Zino',
					url: 'https://codepen.io/natefr0st',
					reason: 'Mario Car Image',
					reasonURL: 'https://codepen.io/natefr0st/pen/GrMrZV'
				}
			],
			args: [
				{
					key: 'opponent',
					prompt: 'What user would you like to challenge?',
					type: 'user'
				},
				{
					key: 'car',
					prompt: `What car do you want to use? Either ${list(cars, 'or')}.`,
					type: 'string',
					oneOf: cars,
					parse: car => car.toLowerCase()
				}
			]
		});
	}

	async run(msg, { opponent, car }) {
		if (opponent.bot) return msg.reply('Bots may not be played against.');
		if (opponent.id === msg.author.id) return msg.reply('You may not play against yourself.');
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
		const bg = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'car-race', 'bg.png'));
		const userCar = await loadImage(
			path.join(__dirname, '..', '..', 'assets', 'images', 'car-race', 'cars', `${car}.png`)
		);
		let oppoCar;
		try {
			const available = cars.filter(car2 => car !== car2);
			await msg.say(`${opponent}, do you accept this challenge?`);
			const verification = await verify(msg.channel, opponent);
			if (!verification) {
				this.client.games.delete(msg.channel.id);
				return msg.say('Looks like they declined...');
			}
			await msg.say(`${opponent}, what car do you want to be? Either ${list(available, 'or')}.`);
			const filter = res => {
				if (res.author.id !== opponent.id) return false;
				return available.includes(res.content.toLowerCase());
			};
			const p2Car = await msg.channel.awaitMessages(filter, {
				max: 1,
				time: 30000
			});
			let car2;
			if (p2Car.size) {
				const choice = p2Car.first().content.toLowerCase();
				car2 = choice;
				oppoCar = await loadImage(
					path.join(__dirname, '..', '..', 'assets', 'images', 'car-race', 'cars', `${choice}.png`)
				);
			} else {
				const chosen = cars[Math.floor(Math.random() * cars.length)];
				car2 = chosen;
				oppoCar = await loadImage(
					path.join(__dirname, '..', '..', 'assets', 'images', 'car-race', 'cars', `${chosen}.png`)
				);
			}
			let userCarSpaces = 0;
			let oppoCarSpaces = 0;
			let lastRoundWinner;
			let lastTurnTimeout = false;
			while (userCarSpaces < 10 && oppoCarSpaces < 10) {
				const board = this.generateBoard(bg, userCar, oppoCar, userCarSpaces, oppoCarSpaces);
				let text;
				if (lastRoundWinner) {
					text = `${lastRoundWinner} pulls ahead!`;
				} else {
					text = stripIndents`
						Welcome to \`car-race\`! Whenever a message pops up, type the word provided.
						Whoever types the word first advances their car!
						Either player can type \`end\` at any time to end the game.
					`;
				}
				await msg.say(`${text}\n\nGet Ready...`, { files: [{ attachment: board, name: 'car-race.png' }] });
				const earlyFilter = res => {
					if (![opponent.id, msg.author.id].includes(res.author.id)) return false;
					return res.content.toLowerCase() === 'end';
				}
				const earlyEnd = await msg.channel.awaitMessages(earlyFilter, {
					max: 1,
					time: randomRange(1000, 30000)
				});
				if (earlyEnd.size) {
					if (win.author.id === msg.author.id) oppoCarSpaces = 10;
					else if (win.author.id === opponent.id) userCarSpaces = 10;
					break;
				}
				const word = words[Math.floor(Math.random() * words.length)];
				await msg.say(`TYPE \`${word.toUpperCase()}\` NOW!`);
				const filter = res => {
					if (![opponent.id, msg.author.id].includes(res.author.id)) return false;
					if (res.content.toLowerCase() === 'end') return true;
					return res.content.toLowerCase() === word;
				};
				const winner = await msg.channel.awaitMessages(filter, {
					max: 1,
					time: 30000
				});
				if (!winner.size) {
					if (lastTurnTimeout) {
						this.client.games.delete(msg.channel.id);
						return msg.say('Game ended due to inactivity.');
					} else {
						await msg.say('Come on, get your head in the game!');
						lastTurnTimeout = true;
						continue;
					}
				}
				const win = winner.first();
				if (win.content.toLowerCase() === 'end') {
					if (win.author.id === msg.author.id) oppoCarSpaces = 10;
					else if (win.author.id === opponent.id) userCarSpaces = 10;
					break;
				}
				if (win.author.id === msg.author.id) userCarSpaces += 1;
				else if (win.author.id === opponent.id) oppoCarSpaces += 1;
				lastRoundWinner = win.author;
				if (lastTurnTimeout) lastTurnTimeout = false;
			}
			this.client.games.delete(msg.channel.id);
			const winner = userCarSpaces > oppoCarSpaces ? msg.author : opponent;
			const winnerCar = winner.id === msg.author.id ? car : car2;
			return msg.say(`Congrats, ${winner}!`, {
				files: [path.join(__dirname, '..', '..', 'assets', 'images', 'car-race', 'cars', `${winnerCar}.png`)]
			});
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}

	generateBoard(bg, userCar, oppoCar, userCarSpaces, oppoCarSpaces) {
		const canvas = createCanvas(bg.width, bg.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(bg, 0, 0);
		const oppoCarX = -155 + (46 * oppoCarSpaces);
		ctx.drawImage(oppoCar, oppoCarX, 208);
		const userCarX = -155 + (46 * userCarSpaces);
		ctx.drawImage(userCar, userCarX, 254);
		return canvas.toBuffer();
	}
};
