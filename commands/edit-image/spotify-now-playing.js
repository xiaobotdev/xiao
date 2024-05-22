const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class SpotifyNowPlayingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'spotify-now-playing',
			aliases: ['now-playing-spotify', 'spotify', 'spotify-playing', 'playing-spotify'],
			group: 'edit-image',
			description: 'Draws an image or a user\'s avatar on a Spotify album with the name and artist of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Spotify',
					url: 'https://www.spotify.com/us/',
					reason: 'Original Design'
				},
				{
					name: 'Sam Thik',
					url: 'https://www.pinterest.com/Samthik/',
					reason: 'Image',
					reasonURL: 'https://www.pinterest.com/pin/500251471109108490/'
				},
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Noto Font',
					reasonURL: 'https://www.google.com/get/noto/'
				}
			],
			args: [
				{
					key: 'name',
					type: 'string',
					max: 50
				},
				{
					key: 'artist',
					type: 'string',
					max: 50
				},
				{
					key: 'image',
					type: 'image-or-avatar',
					avatarSize: 256,
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 256 })
				}
			]
		});
	}

	async run(msg, { name, artist, image }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'spotify-now-playing.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, base.width, base.height);
		const height = 504 / data.width;
		ctx.drawImage(data, 66, 132, 504, height * data.height);
		ctx.drawImage(base, 0, 0);
		ctx.textBaseline = 'top';
		ctx.textAlign = 'center';
		ctx.font = this.client.fonts.get('Noto-Bold.ttf').toCanvasString(25);
		ctx.fillStyle = 'white';
		ctx.fillText(name, base.width / 2, 685);
		ctx.fillStyle = '#bdbec2';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(20);
		ctx.fillText(artist, base.width / 2, 720);
		ctx.fillText('Xiao\'s Picks', base.width / 2, 65);
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'spotify-now-playing.png' }] });
	}
};
