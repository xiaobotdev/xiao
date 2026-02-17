const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const path = require('path');
const { verify, list, randomRange } = require('../../util/Util');
const { greyscale, motionBlur } = require('../../util/Canvas');
const fs = require('fs');
const cars = fs.readdirSync(path.join(__dirname, '..', '..', 'assets', 'images', 'car-race', 'cars'))
	.map(car => car.replace('.png', ''));
const trails = fs.readdirSync(path.join(__dirname, '..', '..', 'assets', 'images', 'car-race', 'trails'))
	.map(trail => trail.replace('.png', ''));
const words = ['go', 'zoom', 'drive', 'advance', 'pedal', 'vroom'];
const difficulties = {
	baby: 5000,
	easy: 3000,
	medium: 2250,
	hard: 1500,
	impossible: 500
};

module.exports = class CarRaceCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'car-race',
			aliases: ['cars', 'race'],
			group: 'games-mp',
			description: 'Race a car against another user or the AI.',
			game: true,
			credit: [
				{
					name: 'iStock',
					url: 'https://www.istockphoto.com/',
					reason: 'Background Image',
					// eslint-disable-next-line max-len
					reasonURL: 'https://www.istockphoto.com/vector/side-view-of-a-road-with-a-crash-barrier-roadside-green-meadow-and-clear-blue-sky-gm1081596948-290039955'
				},
				{
					name: 'Hendrick Motorsports',
					url: 'http://www.hendrickmotorsports.com/',
					reason: 'Earnhardt Car Original Design'
				},
				{
					name: 'Dale Earnhardt Jr.',
					url: 'https://www.dalejr.com/',
					reason: 'Earnhardt Car Original Driver'
				},
				{
					name: 'Disney',
					url: 'https://www.disney.com/',
					reason: 'McQueen/Herbie Cars Original Designs'
				},
				{
					name: 'Pixar Animation Studios',
					url: 'https://www.pixar.com/',
					reason: 'McQueen Car Original Design',
					reasonURL: 'https://www.pixar.com/feature-films/cars'
				},
				{
					name: 'Mattel',
					url: 'https://www.mattel.com/en-us',
					reason: 'Reverb/Deora Cars Original Designs',
					reasonURL: 'https://hotwheels.mattel.com/shop'
				},
				{
					name: 'Sherif Saad',
					url: 'https://www.behance.net/SherifSaad',
					reason: 'AE86 Car Image',
					reasonURL: 'https://www.behance.net/gallery/62672149/AE86-Tattoo'
				},
				{
					name: 'Initial D',
					url: 'https://initiald-portal.com/',
					reason: 'AE86 Car Original Design'
				},
				{
					name: 'Electronic Arts',
					url: 'https://www.ea.com/',
					reason: 'Kitano Car Original Design',
					reasonURL: 'https://www.ea.com/games/burnout'
				},
				{
					name: 'Lotus',
					url: 'https://www.lotuscars.com/en-US/',
					reason: 'Elise Car Original Design'
				},
				{
					name: 'SEGA',
					url: 'https://www.sega.com/',
					reason: 'Sonic Car Original Design',
					reasonURL: 'https://www.sonicthehedgehog.com/'
				},
				{
					name: 'MinionFan1024',
					url: 'https://www.deviantart.com/minionfan1024',
					reason: 'Anakin Car Image',
					reasonURL: 'https://www.deviantart.com/minionfan1024/art/Anakin-s-podracer-829694073'
				},
				{
					name: 'Star Wars',
					url: 'https://www.starwars.com/',
					reason: 'Anakin Car Original Design'
				},
				{
					name: 'Back to the Future',
					url: 'https://www.backtothefuture.com/',
					reason: 'DeLorean Car Original Design'
				},
				{
					name: 'Nintendo',
					url: 'https://www.nintendo.com/',
					reason: 'Mario Car Original Design',
					reasonURL: 'https://mario.nintendo.com/'
				},
				{
					name: 'zekewhipper',
					url: 'https://www.deviantart.com/zekewhipper',
					reason: 'Mach 5 Car Image',
					reasonURL: 'https://www.deviantart.com/zekewhipper/art/Mach-5-My-Version-112814534'
				},
				{
					name: 'Speed Racer',
					url: 'https://www.speedracergogogo.com/',
					reason: 'Mach 5 Car Original Design'
				},
				{
					name: 'Tesla',
					url: 'https://www.tesla.com/',
					reason: 'Cybertruck Car Original Design',
					reasonURL: 'https://www.tesla.com/cybertruck'
				},
				{
					name: 'Zero Error\'s randomised blog',
					url: 'http://yanko06.blogspot.com/',
					reason: 'Lego Car Image',
					reasonURL: 'http://yanko06.blogspot.com/2016/03/nissan-240sx-lego-build.html'
				},
				{
					name: 'LEGO',
					url: 'https://www.lego.com/en-us',
					reason: 'Lego Car Original Design'
				},
				{
					name: 'DashieSparkle',
					url: 'https://www.deviantart.com/dashiesparkle',
					reason: 'Rainbow Car Image',
					reasonURL: 'https://www.deviantart.com/dashiesparkle/art/Vector-475-Rainbow-Dash-58-609921260'
				},
				{
					name: 'Hasbro',
					url: 'https://shop.hasbro.com/en-us',
					reason: 'Rainbow Car Original Design',
					reasonURL: 'https://mylittlepony.hasbro.com/en-us'
				},
				{
					name: 'Jeep',
					url: 'https://www.jeep.com/',
					reason: 'Jeep Car Original Design'
				},
				{
					name: 'The BLOODHOUND Project',
					url: 'https://www.bloodhoundlsr.com/',
					reason: 'Bloodhound Car Image/Original Design'
				},
				{
					name: 'Warner Bros.',
					url: 'https://www.warnerbros.com/',
					reason: 'General Lee Car Original Design'
				},
				{
					name: 'Mr. Bean',
					url: 'https://www.mrbean.com/',
					reason: 'Bean Car Original Design'
				},
				{
					name: 'KYB Sport',
					url: 'https://kybsport.com/',
					reason: 'Miku Car Image',
					reasonURL: 'https://kybsport.com/teams/gsr/'
				},
				{
					name: 'Goodsmile Racing',
					url: 'https://www.goodsmileracing.com/en/',
					reason: 'Miku Car Original Design'
				},
				{
					name: 'Hanna-Barbera',
					url: 'http://www.webrockonline.com/',
					reason: 'Flintstones Car Original Design'
				}
			],
			args: [
				{
					key: 'opponent',
					type: 'user'
				},
				{
					key: 'car',
					type: 'string',
					oneOf: cars,
					parse: car => car.toLowerCase()
				}
			]
		});
	}

	async run(msg, { opponent, car }) {
		if (opponent.id === msg.author.id) return msg.reply('You may not play against yourself.');
		if (this.client.blacklist.user.includes(opponent.id)) return msg.reply('This user is blacklisted.');
		const bg = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'car-race', 'bg.png'));
		const userData = {
			user: msg.author,
			spaces: 0
		};
		const oppoData = {
			user: opponent,
			spaces: 0
		};
		userData.car = await loadImage(
			path.join(__dirname, '..', '..', 'assets', 'images', 'car-race', 'cars', `${car}.png`)
		);
		if (trails.includes(car)) {
			userData.trail = await loadImage(
				path.join(__dirname, '..', '..', 'assets', 'images', 'car-race', 'trails', `${car}.png`)
			);
		}
		const userAvatar = await request.get(
			msg.author.displayAvatarURL({ extension: 'png', size: 128, forceStatic: true })
		);
		userData.avatar = await loadImage(userAvatar.body);
		let difficulty;
		const available = cars.filter(car2 => car !== car2);
		if (opponent.bot) {
			await msg.reply(`What difficulty do you want to use? Either ${list(Object.keys(difficulties), 'or')}.`);
			const difficultyFilter = res => {
				if (res.author.id !== msg.author.id) return false;
				return Object.keys(difficulties).includes(res.content.toLowerCase());
			};
			const difficultyPick = await msg.channel.awaitMessages({
				filter: difficultyFilter,
				max: 1,
				time: 30000
			});
			if (!difficultyPick.size) return msg.say('Failed to pick difficulty. Aborted command.');
			difficulty = difficultyPick.first().content.toLowerCase();
			const oppoCarPick = available[Math.floor(Math.random() * available.length)];
			oppoData.car = await loadImage(
				path.join(__dirname, '..', '..', 'assets', 'images', 'car-race', 'cars', `${oppoCarPick}.png`)
			);
			if (trails.includes(oppoCarPick)) {
				userData.trail = await loadImage(
					path.join(__dirname, '..', '..', 'assets', 'images', 'car-race', 'trails', `${oppoCarPick}.png`)
				);
			}
		} else {
			await msg.say(`${opponent}, do you accept this challenge?`);
			const verification = await verify(msg.channel, opponent);
			if (!verification) return msg.say('Looks like they declined...');
			await msg.say(`${opponent}, what car do you want to be? Either ${list(available, 'or')}.`);
			const filter = res => {
				if (res.author.id !== opponent.id) return false;
				return available.includes(res.content.toLowerCase());
			};
			const p2Car = await msg.channel.awaitMessages({
				filter,
				max: 1,
				time: 30000
			});
			if (p2Car.size) {
				const choice = p2Car.first().content.toLowerCase();
				oppoData.car = await loadImage(
					path.join(__dirname, '..', '..', 'assets', 'images', 'car-race', 'cars', `${choice}.png`)
				);
				if (trails.includes(choice)) {
					userData.trail = await loadImage(
						path.join(__dirname, '..', '..', 'assets', 'images', 'car-race', 'trails', `${choice}.png`)
					);
				}
			} else {
				const chosen = cars[Math.floor(Math.random() * cars.length)];
				oppoData.car = await loadImage(
					path.join(__dirname, '..', '..', 'assets', 'images', 'car-race', 'cars', `${chosen}.png`)
				);
				if (trails.includes(chosen)) {
					userData.trail = await loadImage(
						path.join(__dirname, '..', '..', 'assets', 'images', 'car-race', 'trails', `${chosen}.png`)
					);
				}
			}
		}
		const oppoAvatar = await request.get(opponent.displayAvatarURL({ extension: 'png', size: 128, forceStatic: true }));
		oppoData.avatar = await loadImage(oppoAvatar.body);
		let lastRoundWinner;
		let lastTurnTimeout = false;
		while (userData.spaces < 7 && oppoData.spaces < 7) {
			const board = await this.generateBoard(bg, userData, oppoData, lastRoundWinner);
			let text;
			if (lastRoundWinner) {
				if (userData.spaces > oppoData.spaces || oppoData.spaces > userData.spaces) {
					const leader = userData.spaces > oppoData.spaces ? msg.author : opponent;
					if (leader.id === lastRoundWinner.id) text = `${lastRoundWinner} pulls ahead!`;
					else text = `${lastRoundWinner} catches up!`;
				} else if (userData.spaces === oppoData.spaces) {
					text = `${lastRoundWinner} ties it up!`;
				}
			} else {
				text = stripIndents`
					Welcome to \`car-race\`! Whenever a message pops up, type the word provided.
					Whoever types the word first advances their car!
					Either player can type \`end\` at any time to end the game.
				`;
			}
			await msg.say(`${text}\nGet Ready...`, { files: [{ attachment: board, name: 'car-race.png' }] });
			const earlyFilter = res => {
				if (![opponent.id, msg.author.id].includes(res.author.id)) return false;
				return res.content.toLowerCase() === 'end';
			};
			const earlyEnd = await msg.channel.awaitMessages({
				filter: earlyFilter,
				max: 1,
				time: randomRange(1000, 30000)
			});
			if (earlyEnd.size) {
				if (earlyEnd.first().author.id === msg.author.id) oppoData.spaces = 7;
				else if (earlyEnd.first().author.id === opponent.id) userData.spaces = 7;
				break;
			}
			const word = words[Math.floor(Math.random() * words.length)];
			await msg.say(`TYPE \`${word.toUpperCase()}\` NOW!`);
			const turnFilter = res => {
				if (![opponent.id, msg.author.id].includes(res.author.id)) return false;
				if (res.content.toLowerCase() === 'end') return true;
				return res.content.toLowerCase() === word;
			};
			const winner = await msg.channel.awaitMessages({
				filter: turnFilter,
				max: 1,
				time: opponent.bot ? difficulties[difficulty] : 30000
			});
			if (!winner.size) {
				if (opponent.bot) {
					oppoData.spaces += 1;
					lastRoundWinner = opponent;
					if (lastTurnTimeout) lastTurnTimeout = false;
					continue;
				} else if (lastTurnTimeout) {
					return msg.say('Game ended due to inactivity.');
				} else {
					await msg.say('Come on, get your head in the game!');
					lastTurnTimeout = true;
					continue;
				}
			}
			const win = winner.first();
			if (win.content.toLowerCase() === 'end') {
				if (win.author.id === msg.author.id) {
					oppoData.spaces = 7;
					lastRoundWinner = opponent;
				} else if (win.author.id === opponent.id) {
					userData.spaces = 7;
					lastRoundWinner = msg.author;
				}
				break;
			}
			if (win.author.id === msg.author.id) userData.spaces += 1;
			else if (win.author.id === opponent.id) oppoData.spaces += 1;
			lastRoundWinner = win.author;
			if (lastTurnTimeout) lastTurnTimeout = false;
		}
		const winner = userData.spaces > oppoData.spaces ? msg.author : opponent;
		const board = await this.generateBoard(bg, userData, oppoData, lastRoundWinner, winner);
		return msg.say(`Congrats, ${winner}!`, {
			files: [{ attachment: board, name: 'car-race-win.png' }]
		});
	}

	async generateBoard(bg, userData, oppoData, turnWin, win) {
		const canvas = createCanvas(bg.width, bg.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(bg, 0, 0);
		const oppoCarX = oppoData.spaces < 7 ? -155 + (77 * oppoData.spaces) : bg.width - 155;
		if (turnWin && oppoData.spaces > 0) {
			motionBlur(ctx, oppoData.car, oppoCarX, 208, oppoData.car.width, oppoData.car.height);
			if (oppoData.trail && oppoCarX > oppoData.car.width) {
				for (let x = oppoCarX - oppoData.trail.width; x > -oppoData.trail.width; x -= oppoData.trail.width) {
					motionBlur(ctx, oppoData.trail, x, 208, oppoData.trail.width, oppoData.trail.height);
				}
			}
		} else {
			ctx.drawImage(oppoData.car, oppoCarX, 208);
			if (oppoData.trail && oppoCarX > oppoData.car.width) {
				for (let x = oppoCarX - oppoData.trail.width; x > -oppoData.trail.width; x -= oppoData.trail.width) {
					ctx.drawImage(oppoData.trail, x, 208);
				}
			}
		}
		const userCarX = userData.spaces < 7 ? -155 + (77 * userData.spaces) : bg.width - 155;
		if (turnWin && userData.spaces > 0) {
			motionBlur(ctx, userData.car, userCarX, 254, userData.car.width, userData.car.height);
			if (userData.trail && userCarX > userData.car.width) {
				for (let x = userCarX - userData.trail.width; x > -userData.trail.width; x -= userData.trail.width) {
					motionBlur(ctx, userData.trail, x, 254, userData.trail.width, userData.trail.height);
				}
			}
		} else {
			ctx.drawImage(userData.car, userCarX, 254);
			if (userData.trail && userCarX > userData.car.width) {
				for (let x = userCarX - userData.trail.width; x > -userData.trail.width; x -= userData.trail.width) {
					ctx.drawImage(userData.trail, x, 208);
				}
			}
		}
		if (win) {
			const fireworks = await loadImage(
				path.join(__dirname, '..', '..', 'assets', 'images', 'car-race', 'fireworks.png')
			);
			const congrats = await loadImage(
				path.join(__dirname, '..', '..', 'assets', 'images', 'car-race', 'congrats.png')
			);
			ctx.drawImage(fireworks, 106, -48, 400, 283);
			ctx.drawImage(congrats, (bg.width / 2) - (250 / 2), 21, 250, 62);
			ctx.fillStyle = 'black';
			const x = (bg.width / 2) - 50;
			ctx.fillRect(x - 5, 85, 110, 110);
			ctx.drawImage(win.id === userData.user.id ? userData.avatar : oppoData.avatar, x, 90, 100, 100);
		} else {
			const stars = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'car-race', 'stars.png'));
			const vs = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'car-race', 'vs.png'));
			ctx.drawImage(vs, (bg.width / 2) - (75 / 2), 80, 75, 75);
			ctx.fillStyle = 'black';
			ctx.fillRect(105, 45, 135, 135);
			ctx.drawImage(userData.avatar, 110, 50, 125, 125);
			ctx.fillRect(173, 155, 62, 20);
			ctx.drawImage(userData.car, 173, 155, 62, 20);
			if (turnWin && turnWin.id === userData.user.id) {
				ctx.drawImage(stars, 85, 0, 175, 150);
			} else if (turnWin) {
				greyscale(ctx, 110, 50, 125, 125);
			}
			ctx.fillRect(bg.width - 115 - 125, 45, 135, 135);
			ctx.drawImage(oppoData.avatar, bg.width - 110 - 125, 50, 125, 125);
			ctx.fillRect(440, 155, 62, 20);
			ctx.drawImage(oppoData.car, 440, 155, 62, 20);
			if (turnWin && turnWin.id === oppoData.user.id) {
				ctx.drawImage(stars, bg.width - 110 - 125 - 25, 0, 175, 150);
			} else if (turnWin) {
				greyscale(ctx, bg.width - 110 - 125, 50, 125, 125);
			}
		}
		return canvas.toBuffer('image/png');
	}
};
