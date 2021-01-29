const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const path = require('path');
const { verify, list, randomRange } = require('../../util/Util');
const { greyscale } = require('../../util/Canvas');
const fs = require('fs');
const cars = fs.readdirSync(path.join(__dirname, '..', '..', 'assets', 'images', 'car-race', 'cars'))
	.map(car => car.replace('.png', ''));
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
			memberName: 'car-race',
			description: 'Race a car against another user or the AI.',
			credit: [
				{
					name: 'iStock',
					url: 'https://www.istockphoto.com/',
					reason: 'Background Image',
					// eslint-disable-next-line max-len
					reasonURL: 'https://www.istockphoto.com/vector/side-view-of-a-road-with-a-crash-barrier-roadside-green-meadow-and-clear-blue-sky-gm1081596948-290039955'
				},
				{
					name: 'Currituck County',
					url: 'https://co.currituck.nc.us/',
					reason: 'Fireworks Image',
					reasonURL: 'https://co.currituck.nc.us/fireworks/'
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
				},
				{
					name: 'zekewhipper',
					url: 'https://www.deviantart.com/zekewhipper',
					reason: 'Mach 5 Car Image',
					reasonURL: 'https://www.deviantart.com/zekewhipper/art/Mach-5-My-Version-112814534'
				},
				{
					name: 'Iconscout',
					url: 'https://iconscout.com/',
					reason: 'Runner Car Image',
					reasonURL: 'https://iconscout.com/illustrations/marathon-race'
				},
				{
					name: 'pixabay',
					url: 'https://pixabay.com/',
					reason: 'Cybertruck Car Image',
					reasonURL: 'https://pixabay.com/vectors/tesla-cybertruck-electric-car-4770084/'
				},
				{
					name: 'Zero Error\'s randomised blog',
					url: 'http://yanko06.blogspot.com/',
					reason: 'Lego Car Image',
					reasonURL: 'http://yanko06.blogspot.com/2016/03/nissan-240sx-lego-build.html'
				},
				{
					name: 'Stick PNG',
					url: 'https://www.stickpng.com/',
					reason: 'Horse Car Image',
					reasonURL: 'https://www.stickpng.com/img/animals/horses/race-horse-side-view'
				},
				{
					name: 'DashieSparkle',
					url: 'https://www.deviantart.com/dashiesparkle',
					reason: 'Rainbow Car Image',
					reasonURL: 'https://www.deviantart.com/dashiesparkle/art/Vector-475-Rainbow-Dash-58-609921260'
				},
				{
					name: 'MotorBiscuit',
					url: 'https://www.motorbiscuit.com/',
					reason: 'Pickup Car Image',
					reasonURL: 'https://www.motorbiscuit.com/1000-hp-nissan-franken-navara-worlds-best-pickup-says-builder/'
				},
				{
					name: 'Lake Keowee Chrysler Dodge Jeep Ram',
					url: 'https://www.lakekeoweechryslerdodge.com/',
					reason: 'Jeep Car Image',
					reasonURL: 'https://www.lakekeoweechryslerdodge.com/2017-jeep-wrangler-seneca--sc.htm'
				},
				{
					name: 'The BLOODHOUND Project',
					url: 'https://www.bloodhoundlsr.com/',
					reason: 'Bloodhound Car Image',
					// eslint-disable-next-line max-len
					reasonURL: 'http://sendy.bloodhoundssc.com/w/r66GIuC7uX1SMJnEzBQclA/RYS3PGArp6y5QLtigCCOVA/3JZqlel0Hcux67634uBAdtpg'
				},
				{
					name: 'PNGio.com',
					url: 'https://pngio.com/png',
					reason: 'General Lee Car Image',
					reasonURL: 'https://pngio.com/images/png-a980119.html'
				},
				{
					name: 'PicsArt',
					url: 'https://picsart.com/',
					reason: 'Bean Car Image',
					reasonURL: 'https://picsart.com/i/287426979049211'
				},
				{
					name: 'SeekPNG',
					url: 'https://www.seekpng.com/',
					reason: 'Herbie Car Image',
					reasonURL: 'https://www.seekpng.com/ima/u2q8r5a9y3t4w7u2/'
				},
				{
					name: 'TVS Racing',
					url: 'https://www.tvsracing.com/',
					reason: 'Motorcycle Car Image'
				},
				{
					name: 'KYB Sport',
					url: 'https://kybsport.com/',
					reason: 'Miku Car Image',
					reasonURL: 'https://kybsport.com/teams/gsr/'
				},
				{
					name: 'KOSTYA_ex_tubli',
					url: 'https://www.gran-turismo.com/us/gtsport/user/profile/6290075/overview',
					reason: 'Flintstones Car Image',
					// eslint-disable-next-line max-len
					reasonURL: 'https://www.gran-turismo.com/us/gtsport/user/discover/search/decal/decal/6290075/4684382513076895744'
				},
				{
					name: 'Clipart Library',
					url: 'http://clipart-library.com/',
					reason: 'Plane Car Image',
					reasonURL: 'http://clipart-library.com/clipart/228505.htm'
				},
				{
					name: 'Pin Clipart',
					url: 'https://www.pinclipart.com/',
					reason: 'Wheelchair Car Image',
					reasonURL: 'https://www.pinclipart.com/maxpin/xToJi/'
				}
			],
			args: [
				{
					key: 'opponent',
					prompt: 'What user would you like to challenge? To play against AI, choose me.',
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
		if (opponent.id === msg.author.id) return msg.reply('You may not play against yourself.');
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
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
		const userAvatar = await request.get(msg.author.displayAvatarURL({ format: 'png', size: 128 }));
		userData.avatar = await loadImage(userAvatar.body);
		let difficulty;
		try {
			const available = cars.filter(car2 => car !== car2);
			if (opponent.bot) {
				await msg.reply(`What difficulty do you want to use? Either ${list(Object.keys(difficulties), 'or')}.`);
				const difficultyFilter = res => {
					if (res.author.id !== msg.author.id) return false;
					return Object.keys(difficulties).includes(res.content.toLowerCase());
				};
				const difficultyPick = await msg.channel.awaitMessages(difficultyFilter, {
					max: 1,
					time: 30000
				});
				if (!difficultyPick.size) {
					this.client.games.delete(msg.channel.id);
					return msg.say('Failed to pick difficulty. Aborted command.');
				}
				difficulty = difficultyPick.first().content.toLowerCase();
				const oppoCarPick = available[Math.floor(Math.random() * available.length)];
				oppoData.car = await loadImage(
					path.join(__dirname, '..', '..', 'assets', 'images', 'car-race', 'cars', `${oppoCarPick}.png`)
				);
			} else {
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
				if (p2Car.size) {
					const choice = p2Car.first().content.toLowerCase();
					oppoData.car = await loadImage(
						path.join(__dirname, '..', '..', 'assets', 'images', 'car-race', 'cars', `${choice}.png`)
					);
				} else {
					const chosen = cars[Math.floor(Math.random() * cars.length)];
					oppoData.car = await loadImage(
						path.join(__dirname, '..', '..', 'assets', 'images', 'car-race', 'cars', `${chosen}.png`)
					);
				}
			}
			const oppoAvatar = await request.get(opponent.displayAvatarURL({ format: 'png', size: 128 }));
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
				const earlyEnd = await msg.channel.awaitMessages(earlyFilter, {
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
				const winner = await msg.channel.awaitMessages(turnFilter, {
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
					if (win.author.id === msg.author.id) oppoData.spaces = 7;
					else if (win.author.id === opponent.id) userData.spaces = 7;
					break;
				}
				if (win.author.id === msg.author.id) userData.spaces += 1;
				else if (win.author.id === opponent.id) oppoData.spaces += 1;
				lastRoundWinner = win.author;
				if (lastTurnTimeout) lastTurnTimeout = false;
			}
			this.client.games.delete(msg.channel.id);
			const winner = userData.spaces > oppoData.spaces ? msg.author : opponent;
			const winnerCar = winner.id === msg.author.id ? userData.car : oppoData.car;
			const board = await this.generateBoard(bg, userData, oppoData, null, true, winnerCar);
			return msg.say(`Congrats, ${winner}!`, {
				files: [{ attachment: board, name: 'car-race-win.png' }]
			});
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}

	async generateBoard(bg, userData, oppoData, turnWin, win, winnerCar) {
		const canvas = createCanvas(bg.width, bg.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(bg, 0, 0);
		const oppoCarX = oppoData.spaces < 7 ? -155 + (77 * oppoData.spaces) : bg.width - 155;
		ctx.drawImage(oppoData.car, oppoCarX, 208);
		const userCarX = userData.spaces < 7 ? -155 + (77 * userData.spaces) : bg.width - 155;
		ctx.drawImage(userData.car, userCarX, 254);
		if (win) {
			const fireworks = await loadImage(
				path.join(__dirname, '..', '..', 'assets', 'images', 'car-race', 'fireworks.png')
			);
			const congrats = await loadImage(
				path.join(__dirname, '..', '..', 'assets', 'images', 'car-race', 'congrats.png')
			);
			ctx.drawImage(fireworks, 106, -48, 400, 283);
			ctx.drawImage(congrats, 182, 21, 250, 62);
			ctx.drawImage(winnerCar, 152, 84);
		} else {
			const stars = await loadImage(
				path.join(__dirname, '..', '..', 'assets', 'images', 'car-race', 'stars.png')
			);
			ctx.fillStyle = 'black';
			ctx.fillRect(105, 45, 135, 135);
			ctx.drawImage(userData.avatar, 110, 50, 125, 125);
			if (turnWin && turnWin.id === userData.user.id) {
				ctx.drawImage(stars, 85, 0, 175, 150);
			} else if (turnWin) {
				greyscale(ctx, 110, 50, 125, 125);
			}
			ctx.fillRect(bg.width - 115 - 125, 45, 135, 135);
			ctx.drawImage(oppoData.avatar, bg.width - 110 - 125, 50, 125, 125);
			if (turnWin && turnWin.id === oppoData.user.id) {
				ctx.drawImage(stars, bg.width - 110 - 125 - 25, 0, 175, 150);
			} else if (turnWin) {
				greyscale(ctx, bg.width - 110 - 125, 50, 125, 125);
			}
		}
		return canvas.toBuffer();
	}
};
