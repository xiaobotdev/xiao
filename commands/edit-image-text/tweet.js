const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const { TwitterOpenApi } = require('twitter-openapi-typescript');
const emojiRegex = require('emoji-regex');
const twemoji = require('@twemoji/parser');
const api = new TwitterOpenApi();
const moment = require('moment');
const request = require('node-superfetch');
const { readFile } = require('fs/promises');
const path = require('path');
const { formatNumberK, randomRange } = require('../../util/Util');
const { wrapText } = require('../../util/Canvas');

module.exports = class TweetCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tweet',
			aliases: ['fake-tweet', 'twitter', 'x-post', 'excrete', 'xcrete', 'crete'],
			group: 'edit-image-text',
			memberName: 'tweet',
			description: 'Sends a Twitter tweet with the user and text of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Twitter',
					url: 'https://twitter.com/',
					reason: 'Image, Chirp Font, API',
					reasonURL: 'https://developer.twitter.com/en/docs.html'
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
					key: 'user',
					type: 'string',
					max: 15
				},
				{
					key: 'text',
					type: 'string',
					max: 280
				},
				{
					key: 'image',
					type: 'image',
					default: ''
				}
			]
		});

		this.guestClient = null;
	}

	async run(msg, { user, text, image }) {
		if (!this.guestClient) this.guestClient = await api.getGuestClient();
		const userData = await this.fetchUser(user);
		const avatar = await loadImage(userData.avatar);
		const base1 = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'tweet', 'bg-1.png'));
		const base2 = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'tweet', 'bg-2.png'));
		const canvas = createCanvas(base1.width, base1.height + base2.height);
		const ctx = canvas.getContext('2d');
		ctx.font = this.client.fonts.get('ChirpRegular.ttf').toCanvasString(23);
		const lines = wrapText(ctx, text, 710, true);
		const metrics = ctx.measureText(lines.join('\n'));
		const linesLen = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent + 15;
		canvas.height += linesLen;
		let imageHeight = 0;
		ctx.fillStyle = 'black';
		ctx.fillRect(0, base1.height, canvas.width, linesLen);
		if (image) {
			const { body } = await request.get(image);
			const imageData = await loadImage(body);
			const imageHeightRatio = 740 / imageData.width;
			imageHeight = imageData.height * imageHeightRatio;
			const imageCanvas = createCanvas(740, imageHeight);
			const imageCtx = imageCanvas.getContext('2d');
			canvas.height += imageHeight + 15;
			ctx.fillRect(0, base1.height, canvas.width, linesLen + imageHeight + 15);
			const x = 0;
			const y = 0;
			const imageWidth = 740;
			const radius = 15;
			imageCtx.beginPath();
			imageCtx.moveTo(x + radius, y);
			imageCtx.lineTo(x + imageWidth - radius, y);
			imageCtx.quadraticCurveTo(x + imageWidth, y, x + imageWidth, y + radius);
			imageCtx.lineTo(x + imageWidth, y + imageHeight - radius);
			imageCtx.quadraticCurveTo(x + imageWidth, y + imageHeight, x + imageWidth - radius, y + imageHeight);
			imageCtx.lineTo(x + radius, y + imageHeight);
			imageCtx.quadraticCurveTo(x, y + imageHeight, x, y + imageHeight - radius);
			imageCtx.lineTo(x, y + radius);
			imageCtx.quadraticCurveTo(x, y, x + radius, y);
			imageCtx.closePath();
			imageCtx.clip();
			imageCtx.drawImage(imageData, 0, 0, imageWidth, imageHeight);
			ctx.drawImage(imageCanvas, 17, base1.height + linesLen, imageWidth, imageHeight);
		}
		const likes = randomRange(Math.ceil(userData.followers * 0.0015), Math.ceil(userData.followers * 0.002));
		const retweets = randomRange(Math.ceil(userData.followers * 0.00015), Math.ceil(userData.followers * 0.0002));
		const quotTweets = randomRange(Math.ceil(userData.followers * 0.000015), Math.ceil(userData.followers * 0.00002));
		const replies = randomRange(Math.ceil(userData.followers * 0.000015), Math.ceil(userData.followers * 0.00002));
		const bookmarks = randomRange(Math.ceil(userData.followers * 0.000015), Math.ceil(userData.followers * 0.00002));
		const views = randomRange(Math.ceil(userData.followers * 10), Math.ceil(userData.followers * 30));
		ctx.drawImage(base1, 0, 0);
		const base2StartY = base1.height + linesLen + (image ? imageHeight + 15 : 0);
		ctx.drawImage(base2, 0, base2StartY);
		ctx.textBaseline = 'top';
		ctx.font = this.client.fonts.get('ChirpBold.ttf').toCanvasString(18);
		ctx.fillStyle = 'white';
		ctx.fillText(userData.name, 80, 88);
		if (userData.verified) {
			const verified = await loadImage(
				path.join(__dirname, '..', '..', 'assets', 'images', 'tweet', 'verified.png')
			);
			const nameLen = ctx.measureText(userData.name).width;
			ctx.drawImage(verified, 80 + nameLen + 3, 90, 20, 20);
		}
		ctx.font = this.client.fonts.get('ChirpRegular.ttf').toCanvasString(17);
		ctx.fillStyle = '#71767b';
		ctx.fillText(`@${userData.screenName}`, 80, 113);
		ctx.fillStyle = 'white';
		ctx.font = this.client.fonts.get('ChirpRegular.ttf').toCanvasString(23);
		await this.fillTextWithEmoji(ctx, text, 17, 160, 710, 26);
		ctx.fillStyle = '#71767b';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(18);
		const time = moment().format('h:mm A ∙ MMM D, YYYY ∙');
		ctx.fillText(time, 18, base2StartY + 12);
		const timeLen = ctx.measureText(time).width;
		ctx.fillStyle = 'white';
		ctx.font = this.client.fonts.get('Noto-Bold.ttf').toCanvasString(18);
		ctx.fillText(formatNumberK(views), 18 + timeLen + 6, base2StartY + 12);
		const viewsLen = ctx.measureText(formatNumberK(views)).width;
		ctx.fillStyle = '#71767b';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(18);
		ctx.fillText('Views', 18 + timeLen + 6 + viewsLen + 6, base2StartY + 12);
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(16);
		ctx.fillText(formatNumberK(replies), 64, base2StartY + 145);
		ctx.fillText(formatNumberK(likes), 415, base2StartY + 145);
		ctx.fillText(formatNumberK(retweets + quotTweets), 242, base2StartY + 145);
		ctx.fillText(formatNumberK(bookmarks), 588, base2StartY + 145);
		let currentLen = 17;
		ctx.fillStyle = 'white';
		ctx.font = this.client.fonts.get('Noto-Bold.ttf').toCanvasString(18);
		ctx.fillText(formatNumberK(retweets), currentLen, base2StartY + 75);
		currentLen += ctx.measureText(formatNumberK(retweets)).width;
		currentLen += 5;
		ctx.fillStyle = '#71767b';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(18);
		ctx.fillText('Reposts', currentLen, base2StartY + 75);
		currentLen += ctx.measureText('Reposts').width;
		currentLen += 10;
		ctx.fillStyle = 'white';
		ctx.font = this.client.fonts.get('Noto-Bold.ttf').toCanvasString(18);
		ctx.fillText(formatNumberK(quotTweets), currentLen, base2StartY + 75);
		currentLen += ctx.measureText(formatNumberK(quotTweets)).width;
		currentLen += 5;
		ctx.fillStyle = '#71767b';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(18);
		ctx.fillText('Quotes', currentLen, base2StartY + 75);
		currentLen += ctx.measureText('Quotes').width;
		currentLen += 10;
		ctx.fillStyle = 'white';
		ctx.font = this.client.fonts.get('Noto-Bold.ttf').toCanvasString(18);
		ctx.fillText(formatNumberK(likes), currentLen, base2StartY + 75);
		currentLen += ctx.measureText(formatNumberK(likes)).width;
		currentLen += 5;
		ctx.fillStyle = '#71767b';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(18);
		ctx.fillText('Likes', currentLen, base2StartY + 75);
		currentLen += ctx.measureText('Likes').width;
		currentLen += 10;
		ctx.fillStyle = 'white';
		ctx.font = this.client.fonts.get('Noto-Bold.ttf').toCanvasString(18);
		ctx.fillText(formatNumberK(bookmarks), currentLen, base2StartY + 75);
		currentLen += ctx.measureText(formatNumberK(bookmarks)).width;
		currentLen += 5;
		ctx.fillStyle = '#71767b';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(18);
		ctx.fillText('Bookmarks', currentLen, base2StartY + 75);
		ctx.beginPath();
		ctx.arc(17 + 26, 84 + 26, 26, 0, Math.PI * 2);
		ctx.closePath();
		ctx.clip();
		ctx.drawImage(avatar, 17, 84, 52, 52);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'tweet.png' }] });
	}

	async fillTextWithEmoji(ctx, text, x, y, maxLineLen, emojiSize) {
		const wrapped = wrapText(ctx, text, maxLineLen, true);
		const emoji = text.match(emojiRegex());
		if (!emoji) {
			ctx.fillText(wrapped.join('\n'), x, y);
			return ctx;
		}
		for (let currentLine = 0; currentLine < wrapped.length; currentLine++) {
			const line = wrapped[currentLine];
			const lineNoEmoji = line.split(emojiRegex());
			const lineEmoji = line.match(emojiRegex());
			const height = 23 + 9;
			if (!lineEmoji) {
				ctx.fillText(line, x, y + (height * currentLine));
				continue;
			}
			let currentX = x;
			for (let i = 0; i < lineNoEmoji.length; i++) {
				const linePart = lineNoEmoji[i];
				ctx.fillText(linePart, currentX, y + (height * currentLine));
				currentX += ctx.measureText(linePart).width;
				const parsedEmoji = twemoji.parse(lineEmoji[i]);
				if (!parsedEmoji.length || !parsedEmoji[0].url) continue;
				const { body } = await request.get(parsedEmoji[0].url);
				const loadedEmoji = await loadImage(body);
				loadedEmoji.width = emojiSize;
				loadedEmoji.height = emojiSize;
				ctx.drawImage(loadedEmoji, currentX, y + (height * currentLine), emojiSize, emojiSize);
				currentX += emojiSize;
			}
		}
		return ctx;
	}

	async fetchUser(user) {
		try {
			const { data } = await this.guestClient.getUserApi().getUserByScreenName({ screenName: user });
			const body = data.user.legacy;
			const avatarRes = await request.get(body.profileImageUrlHttps);
			return {
				screenName: body.screenName,
				name: body.name,
				avatar: avatarRes.body,
				verified: data.user.isBlueVerified,
				followers: body.followersCount
			};
		} catch {
			const defaultPfp = await readFile(path.join(__dirname, '..', '..', 'assets', 'images', 'tweet', 'default.png'));
			return {
				screenName: user,
				name: 'Unknown User',
				avatar: defaultPfp,
				verified: false,
				followers: 0
			};
		}
	}
};
