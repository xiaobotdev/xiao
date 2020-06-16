const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { list } = require('../../util/Util');
const hats = require('../../assets/json/hat');

module.exports = class HatCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hat',
			group: 'edit-avatar',
			memberName: 'hat',
			description: 'Draws a hat over a user\'s avatar.',
			details: `**Hats:** ${hats.join(', ')}`,
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Go Nintendo',
					url: 'https://gonintendo.com/',
					reason: 'Ash Hat Image',
					reasonURL: 'https://gonintendo.com/stories/306292'
				},
				{
					name: 'freeiconspng.com',
					url: 'https://www.freeiconspng.com/',
					reason: 'Birthday Hat Image',
					reasonURL: 'https://www.freeiconspng.com/img/43917'
				},
				{
					name: 'Know Your Meme',
					url: 'https://knowyourmeme.com/',
					reason: 'Christmas Hat Image',
					reasonURL: 'https://knowyourmeme.com/forums/just-for-fun/topics/24821-christmas-hat-thread'
				},
				{
					name: 'xertris',
					url: 'https://www.deviantart.com/xertris',
					reason: 'Dunce Hat Image',
					reasonURL: 'https://www.deviantart.com/xertris/art/Dunce-Cap-634349483'
				},
				{
					name: 'Clipart Library',
					url: 'http://clipart-library.com/',
					reason: 'Leprechaun Hat Image',
					reasonURL: 'http://clipart-library.com/clipart/1107361.htm'
				},
				{
					name: 'RedBubble - Akbar Mna',
					url: 'https://www.redbubble.com/en/people/akbarmna/shop',
					reason: 'Megumin Hat Image',
					reasonURL: 'https://www.redbubble.com/people/akbarmna/works/25443591-megumins-hat-minimalistic?p=poster'
				},
				{
					name: 'Gallery Yopriceville',
					url: 'https://gallery.yopriceville.com/',
					reason: 'Pilgrim Hat Image',
					// eslint-disable-next-line max-len
					reasonURL: 'https://gallery.yopriceville.com/Free-Clipart-Pictures/Thanksgiving-PNG/Transparent_Brown_Pilgrim_Hat_PNG_Clipart'
				},
				{
					name: 'DynamicPickaxe',
					url: 'http://dynamicpickaxe.com/',
					reason: 'Pirate Hat Image',
					reasonURL: 'http://dynamicpickaxe.com/pirate-hat-clipart.html'
				},
				{
					name: 'ClipartsFree',
					url: 'https://www.clipartsfree.net/',
					reason: 'Top Hat Image',
					reasonURL: 'https://www.clipartsfree.net/clipart/51355-gray-top-hat-clipart.html'
				},
				{
					name: 'KissClipart.com',
					url: 'https://www.kissclipart.com/',
					reason: 'Witch Hat Image',
					reasonURL: 'https://www.kissclipart.com/halloween-witch-hat-clipart-witch-hat-clip-art-qfycyt/'
				},
				{
					name: 'festivalclaca.cat',
					url: 'https://www.festivalclaca.cat/',
					reason: 'Soviet Hat Image',
					reasonURL: 'https://www.festivalclaca.cat/maxvi/mmbwJ/'
				},
				{
					name: 'Pokémon',
					url: 'https://www.pokemon.com/us/',
					reason: 'Ash Hat Original Anime'
				},
				{
					name: 'KONOSUBA -God\'s blessing on this wonderful world!',
					url: 'http://konosuba.com/',
					reason: 'Megumin Hat Original Anime'
				},
				{
					name: 'StickPNG',
					url: 'https://www.stickpng.com/',
					reason: 'Mask Hat Image',
					reasonURL: 'https://www.stickpng.com/img/science/pandemic/white-surgical-face-mask-front-view'
				},
				{
					name: 'Why We Protest',
					url: 'https://whyweprotest.net/',
					reason: 'Anon Hat Image',
					reasonURL: 'https://whyweprotest.net/threads/big-ass-guy-fawkes-mask-images-thread.22719/'
				},
				{
					name: 'WebStockReview',
					url: 'https://webstockreview.net/',
					reason: 'Devil Hat Image',
					reasonURL: 'https://webstockreview.net/explore/horn-clipart-purple-devil/'
				}
			],
			args: [
				{
					key: 'type',
					prompt: `What type of hat would you like to use? Either ${list(hats, 'or')}.`,
					type: 'string',
					oneOf: hats,
					parse: type => type.toLowerCase()
				},
				{
					key: 'user',
					prompt: 'Which user would you like to edit the avatar of?',
					type: 'user',
					default: msg => msg.author
				},
				{
					key: 'addX',
					prompt: 'How far do you want to move the hat on the X-Axis?',
					type: 'integer',
					default: 0
				},
				{
					key: 'addY',
					prompt: 'How far do you want to move the hat on the Y-Axis?',
					type: 'integer',
					default: 0
				},
				{
					key: 'scale',
					prompt: 'By what percentage do you want to scale your hat?',
					type: 'integer',
					min: 0,
					max: 1000,
					default: 0
				}
			]
		});
	}

	async run(msg, { type, user, addX, addY, scale }) {
		scale /= 100;
		if (scale === 0) scale = 1;
		const avatarURL = user.displayAvatarURL({ format: 'png', size: 512 });
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'hat', `${type}.png`));
			const { body } = await request.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(avatar.width, avatar.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(avatar, 0, 0);
			ctx.drawImage(base, 0 + addX, 0 + addY, avatar.width * scale, avatar.height * scale);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: `${type}-hat.png` }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
