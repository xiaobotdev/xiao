const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');
const hats = require('../../assets/json/hat');
const hatsKeys = Object.keys(hats);

module.exports = class HatCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hat',
			group: 'edit-avatar',
			description: 'Draws a hat over a user\'s avatar.',
			details: `**Hats:** ${hatsKeys.join(', ')}`,
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'xertris',
					url: 'https://www.deviantart.com/xertris',
					reason: 'Dunce Hat Image',
					reasonURL: 'https://www.deviantart.com/xertris/art/Dunce-Cap-634349483'
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
					name: 'Becel',
					url: 'https://www.becel.ca/en-ca',
					reason: 'Becel Hat Image'
				},
				{
					name: 'Nintendo',
					url: 'https://www.nintendo.com/',
					reason: 'Mario Hat Image'
				},
				{
					name: 'Star Wars',
					url: 'https://www.starwars.com/',
					reason: 'Yoda Hat Image'
				}
			],
			args: [
				{
					key: 'type',
					type: 'string',
					oneOf: ['random', ...hatsKeys],
					parse: type => type.toLowerCase()
				},
				{
					key: 'user',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	async run(msg, { type, user }) {
		if (type === 'random') type = hatsKeys[Math.floor(Math.random() * hatsKeys.length)];
		const hat = hats[type];
		const avatarURL = user.displayAvatarURL({ extension: 'png', size: 512, forceStatic: true });
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'hat', hat.file));
		const { body } = await request.get(avatarURL);
		const avatar = await loadImage(body);
		const canvas = createCanvas(avatar.width, avatar.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(avatar, 0, 0);
		ctx.drawImage(base, 0, 0, avatar.width, avatar.height);
		const comment = user.id === this.client.user.id ? hat.commentMe : hat.comment.replace(/{{user}}/g, user.tag);
		return msg.say(comment, { files: [{ attachment: canvas.toBuffer('image/png'), name: `${type}-hat.png` }] });
	}
};
