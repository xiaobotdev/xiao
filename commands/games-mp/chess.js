const Command = require('../../structures/Command');
const jsChess = require('js-chess-engine');
const { createCanvas, loadImage } = require('canvas');
const { stripIndents } = require('common-tags');
const path = require('path');
const { verify, reactIfAble } = require('../../util/Util');
const { FAILURE_EMOJI_ID } = process.env;
const turnRegex = /^([A-H][1-8]) ?([A-H][1-8])$/;
const pieces = ['pawn', 'rook', 'knight', 'king', 'queen', 'bishop'];
const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

module.exports = class ChessCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'chess',
			group: 'games-mp',
			memberName: 'chess',
			description: 'Play a game of Chess with another user or the AI.',
			credit: [
				{
					name: 'Chessboard Image',
					url: 'https://chessboardimage.com/',
					reason: 'Piece Images'
				},
				{
					name: 'Wikimedia Commons',
					url: 'https://commons.wikimedia.org/wiki/Main_Page',
					reason: 'Board Image',
					reasonURL: 'https://commons.wikimedia.org/wiki/File:Chess_board_blank.svg'
				}
			],
			args: [
				{
					key: 'opponent',
					prompt: 'What user would you like to challenge?',
					type: 'user',
					default: () => this.client.user
				}
			]
		});

		this.images = null;
	}

	async run(msg, { opponent }) {
		if (opponent.id === msg.author.id) return msg.reply('You may not play against yourself.');
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
		if (!this.images) await this.loadImages();
		try {
			if (!opponent.bot) {
				await msg.say(`${opponent}, do you accept this challenge?`);
				const verification = await verify(msg.channel, opponent);
				if (!verification) {
					this.client.games.delete(msg.channel.id);
					return msg.say('Looks like they declined...');
				}
			}
			const game = new jsChess.Game();
			let lastTurnTimeout = false;
			while (!game.exportJson().checkMate) {
				const user = game.exportJson().turn === 'black' ? opponent : msg.author;
				const gameState = game.exportJson();
				if (opponent.bot && !userTurn) {
					game.aiMove(3);
				} else {
					await msg.say(stripIndents`
						${user}, what move do you want to make (ex. A1A2)? Type \`end\` to forfeit.
						_You are ${gameState.check ? '**in check!**' : 'not in check.'}_
					`, { files: [{ attachment: this.displayBoard(gameState), name: 'chess.png' }] });
					const pickFilter = res => {
						if (res.author.id !== user.id) return false;
						const choice = res.content.toUpperCase();
						if (choice === 'END') return true;
						const move = choice.match(turnRegex);
						if (!move) return false;
						const moves = game.moves();
						if (!moves[move[1]].includes(move[2])) {
							reactIfAble(res, res.author, FAILURE_EMOJI_ID, '❌');
							return false;
						}
						return true;
					};
					const turn = await msg.channel.awaitMessages(pickFilter, {
						max: 1,
						time: 60000
					});
					if (!turn.size) {
						if (lastTurnTimeout) {
							await msg.say('Game ended due to inactivity.');
							break;
						} else {
							await msg.say('Sorry, time is up! Playing random move.');
							const moves = game.moves();
							const pieces = Object.keys(moves);
							const piece = pieces[Math.floor(Math.random() * pieces.length)];
							const move = moves[piece][Math.floor(Math.random() * moves[piece].length)];
							game.move(piece, move);
							lastTurnTimeout = true;
							continue;
						}
					}
					const choice = turn.first().content.toUpperCase().match(turnRegex);
					game.move(choice[1], choice[2]);
				}
			}
			this.client.games.delete(msg.channel.id);
			const gameState = game.exportJson();
			if (!gameState.checkMate) return msg.say('Game ended due to inactivity or forfeit.');
			const winner = gameState.turn === 'black' ? msg.author : opponent;
			return msg.say(`Checkmate! Congrats, ${winner}!`, {
				files: [{ attachment: this.displayBoard(gameState), name: 'chess.png' }]
			});
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}

	displayBoard(gameState) {
		const canvas = createCanvas(this.images.board.width, this.images.board.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(this.images.board, 0, 0);
		let w = 36;
		let h = 40;
		let row = 8;
		let col = 0;
		for (let i = 0; i < 64; i++) {
			const piece = gameState.pieces[`${cols[col]}${row}`];
			if (!piece) continue;
			const parsed = this.pickImage(piece);
			ctx.drawImage(this.images[parsed.color][parsed.name], w, h, 52, 52);
			w += 52 + 2;
			col += 1;
			if (i % 8 === 0 && i !== 0) {
				w = 36;
				col = 0;
				h += 52 + 2;
				row -= 1;
			}
		}
		return canvas.toBuffer();
	}

	async loadImages() {
		const images = { black: {}, white: {} };
		images.board = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'chess', 'board.png'));
		for (const piece of pieces) {
			const blk = `black-${piece}.png`;
			images.black[piece] = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'chess', blk));
			const whi = `white-${piece}.png`;
			images.white[piece] = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'chess', whi));
		}
		this.images = images;
		return images;
	}

	pickImage(piece) {
		let name;
		let color;
		switch (piece) {
			case 'p':
				name = 'pawn';
				color = 'black';
				break;
			case 'n':
				name = 'knight';
				color = 'black';
				break;
			case 'b':
				name = 'bishop';
				color = 'black';
				break;
			case 'r':
				name = 'rook';
				color = 'black';
				break;
			case 'q':
				name = 'queen';
				color = 'black';
				break;
			case 'k':
				name = 'king';
				color = 'black';
				break;
			case 'P':
				name = 'pawn';
				color = 'white';
				break;
			case 'N':
				name = 'knight';
				color = 'white';
				break;
			case 'B':
				name = 'bishop';
				color = 'white';
				break;
			case 'R':
				name = 'rook';
				color = 'white';
				break;
			case 'Q':
				name = 'queen';
				color = 'white';
				break;
			case 'K':
				name = 'king';
				color = 'white';
				break;
		}
		return { name, color };
	}
};
