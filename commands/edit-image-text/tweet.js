const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const { TwitterOpenApi } = require('twitter-openapi-typescript');
const emojiRegex = require('emoji-regex');
const twemoji = require('@twemoji/parser');
const api = new TwitterOpenApi();
const moment = require('moment');
const request = require('node-superfetch');
const { readFile } = require('fs/promises');
const path = require('path');
const { formatNumberK, randomRange } = require('../../util/Util');
const { wrapText, fillTextWithBreaks, measureTextHeightWithBreaks } = require('../../util/Canvas');

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
	}

	async run(msg, { user, text, image }) {
		const userData = await this.fetchUser(user);
		const avatar = await loadImage(userData.avatar);
		const base1 = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'tweet', 'bg-1.png'));
		const base2 = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'tweet', 'bg-2.png'));
		const canvas = createCanvas(base1.width, base1.height + base2.height);
		const ctx = canvas.getContext('2d');
		ctx.font = this.client.fonts.get('ChirpRegular.ttf').toCanvasString(23);
		const lines = wrapText(ctx, text, 710, true);
		const metrics = measureTextHeightWithBreaks(ctx, lines.join('\n'));
		const linesLen = metrics + 5;
		canvas.height += linesLen;
		let imageHeight = 0;
		ctx.fillStyle = 'black';
		ctx.fillRect(0, base1.height, canvas.width, linesLen);
		if (image) {
			const { body } = await request.get(image);
			const imageData = await loadImage(body);
			const imageWidth = 740;
			const imageHeightRatio = imageWidth / imageData.width;
			imageHeight = imageData.height * imageHeightRatio;
			const imageCanvas = createCanvas(imageWidth, imageHeight);
			const imageCtx = imageCanvas.getContext('2d');
			canvas.height += imageHeight + 15;
			ctx.fillRect(0, base1.height, canvas.width, linesLen + imageHeight + 15);
			const x = 0;
			const y = 0;
			const radius = 15;
			this.roundedPath(imageCtx, radius, x, y, imageWidth, imageHeight);
			imageCtx.clip();
			imageCtx.drawImage(imageData, x, y, imageWidth, imageHeight);
			this.roundedPath(imageCtx, radius, x, y, imageWidth, imageHeight);
			imageCtx.strokeStyle = '#303336';
			imageCtx.lineWidth = 5;
			imageCtx.stroke();
			ctx.drawImage(imageCanvas, 17, base1.height + linesLen + 15, imageWidth, imageHeight);
		}
		const likes = randomRange(Math.ceil(userData.followers * 0.0015), Math.ceil(userData.followers * 0.002));
		const retweets = randomRange(Math.ceil(userData.followers * 0.00015), Math.ceil(userData.followers * 0.0002));
		const quotTweets = randomRange(Math.ceil(userData.followers * 0.000015), Math.ceil(userData.followers * 0.00002));
		const replies = randomRange(Math.ceil(userData.followers * 0.000015), Math.ceil(userData.followers * 0.00002));
		const bookmarks = randomRange(Math.ceil(userData.followers * 0.000015), Math.ceil(userData.followers * 0.00002));
		const views = randomRange(Math.ceil(userData.followers * 10), Math.ceil(userData.followers * 30));
		ctx.drawImage(base1, 0, 0);
		const base2StartY = base1.height + linesLen + (image ? imageHeight + 15 : 0);
		ctx.drawImage(base2, 0, base2StartY - 1);
		ctx.textBaseline = 'top';
		ctx.font = this.client.fonts.get('ChirpBold.ttf').toCanvasString(18);
		ctx.fillStyle = 'white';
		ctx.fillText(userData.name, 80, 91);
		const nameLen = ctx.measureText(userData.name).width;
		if (userData.checkType) {
			const verified = await loadImage(
				path.join(__dirname, '..', '..', 'assets', 'images', 'tweet', `${userData.checkType}.png`)
			);
			ctx.drawImage(verified, 80 + nameLen + 3, 90, 20, 20);
		}
		if (userData.label) {
			const labelData = await request.get(userData.label);
			const labelImg = await loadImage(labelData.body);
			const labelCanvas = createCanvas(24, 24);
			const labelCtx = labelCanvas.getContext('2d');
			this.roundedPath(labelCtx, 3, 0, 0, 24, 24);
			labelCtx.clip();
			labelCtx.fillStyle = '#303336';
			labelCtx.fillRect(0, 0, 24, 24);
			this.roundedPath(labelCtx, 3, 2, 2, 20, 20);
			labelCtx.clip();
			labelCtx.drawImage(labelImg, 2, 2, 20, 20);
			ctx.drawImage(labelCanvas, 80 + nameLen + 3 + 20 + 3, 90, 20, 20);
		}
		ctx.font = this.client.fonts.get('ChirpRegular.ttf').toCanvasString(17);
		ctx.fillStyle = '#71767b';
		ctx.fillText(`@${userData.screenName}`, 80, 116);
		ctx.fillStyle = 'white';
		ctx.font = this.client.fonts.get('ChirpRegular.ttf').toCanvasString(23);
		await this.fillTextWithEmoji(ctx, text, 17, 160, 713, 26);
		ctx.fillStyle = '#71767b';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(18);
		const time = moment().format('h:mm A ∙ MMM D, YYYY ∙');
		ctx.fillText(time, 18, base2StartY + 15);
		const timeLen = ctx.measureText(time).width;
		ctx.fillStyle = 'white';
		ctx.font = this.client.fonts.get('Noto-Bold.ttf').toCanvasString(18);
		ctx.fillText(formatNumberK(views), 18 + timeLen + 6, base2StartY + 15);
		const viewsLen = ctx.measureText(formatNumberK(views)).width;
		ctx.fillStyle = '#71767b';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(18);
		ctx.fillText('Views', 18 + timeLen + 6 + viewsLen + 6, base2StartY + 15);
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(16);
		ctx.fillText(formatNumberK(replies), 64, base2StartY + 148);
		ctx.fillText(formatNumberK(likes), 415, base2StartY + 148);
		ctx.fillText(formatNumberK(retweets + quotTweets), 242, base2StartY + 148);
		ctx.fillText(formatNumberK(bookmarks), 588, base2StartY + 148);
		let currentLen = 17;
		ctx.fillStyle = 'white';
		ctx.font = this.client.fonts.get('Noto-Bold.ttf').toCanvasString(18);
		ctx.fillText(formatNumberK(retweets), currentLen, base2StartY + 78);
		currentLen += ctx.measureText(formatNumberK(retweets)).width;
		currentLen += 5;
		ctx.fillStyle = '#71767b';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(18);
		ctx.fillText('Reposts', currentLen, base2StartY + 78);
		currentLen += ctx.measureText('Reposts').width;
		currentLen += 10;
		ctx.fillStyle = 'white';
		ctx.font = this.client.fonts.get('Noto-Bold.ttf').toCanvasString(18);
		ctx.fillText(formatNumberK(quotTweets), currentLen, base2StartY + 78);
		currentLen += ctx.measureText(formatNumberK(quotTweets)).width;
		currentLen += 5;
		ctx.fillStyle = '#71767b';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(18);
		ctx.fillText('Quotes', currentLen, base2StartY + 78);
		currentLen += ctx.measureText('Quotes').width;
		currentLen += 10;
		ctx.fillStyle = 'white';
		ctx.font = this.client.fonts.get('Noto-Bold.ttf').toCanvasString(18);
		ctx.fillText(formatNumberK(likes), currentLen, base2StartY + 78);
		currentLen += ctx.measureText(formatNumberK(likes)).width;
		currentLen += 5;
		ctx.fillStyle = '#71767b';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(18);
		ctx.fillText('Likes', currentLen, base2StartY + 78);
		currentLen += ctx.measureText('Likes').width;
		currentLen += 10;
		ctx.fillStyle = 'white';
		ctx.font = this.client.fonts.get('Noto-Bold.ttf').toCanvasString(18);
		ctx.fillText(formatNumberK(bookmarks), currentLen, base2StartY + 78);
		currentLen += ctx.measureText(formatNumberK(bookmarks)).width;
		currentLen += 5;
		ctx.fillStyle = '#71767b';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(18);
		ctx.fillText('Bookmarks', currentLen, base2StartY + 78);
		if (userData.avatarShape === 'Circle') {
			ctx.beginPath();
			ctx.arc(17 + 26, 84 + 26, 26, 0, Math.PI * 2);
			ctx.closePath();
			ctx.clip();
		} else {
			this.roundedPath(ctx, 5, 17, 84, 52, 52);
			ctx.clip();
		}
		ctx.drawImage(avatar, 17, 84, 52, 52);
		canvas.height -= 1;
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'tweet.png' }] });
	}

	roundedPath(ctx, radius, x, y, imageWidth, imageHeight) {
		ctx.beginPath();
		ctx.moveTo(x + radius, y);
		ctx.lineTo(x + imageWidth - radius, y);
		ctx.quadraticCurveTo(x + imageWidth, y, x + imageWidth, y + radius);
		ctx.lineTo(x + imageWidth, y + imageHeight - radius);
		ctx.quadraticCurveTo(x + imageWidth, y + imageHeight, x + imageWidth - radius, y + imageHeight);
		ctx.lineTo(x + radius, y + imageHeight);
		ctx.quadraticCurveTo(x, y + imageHeight, x, y + imageHeight - radius);
		ctx.lineTo(x, y + radius);
		ctx.quadraticCurveTo(x, y, x + radius, y);
		ctx.closePath();
		return ctx;
	}

	async fillTextWithEmoji(ctx, text, x, y, maxLineLen, emojiSize) {
		const wrapped = wrapText(ctx, text, maxLineLen, true);
		const emoji = text.match(emojiRegex());
		if (!emoji) {
			fillTextWithBreaks(ctx, wrapped.join('\n'), x, y);
			this.fillHashtags(ctx, wrapped, x, y, emojiSize);
			return ctx;
		}
		let currentY = y;
		for (let currentLine = 0; currentLine < wrapped.length; currentLine++) {
			const line = wrapped[currentLine];
			if (line === '') {
				const metrics = ctx.measureText('a');
				currentY += metrics.emHeightAscent + metrics.emHeightDescent;
				continue;
			}
			const lineEmoji = line.match(emojiRegex());
			let currentX = x;
			const metrics = ctx.measureText(line);
			if (!lineEmoji) {
				ctx.fillText(line, x, currentY);
				currentY += metrics.emHeightAscent + metrics.emHeightDescent;
				continue;
			}
			const lineNoEmoji = line.split(emojiRegex());
			for (let i = 0; i < lineNoEmoji.length; i++) {
				const linePart = lineNoEmoji[i];
				ctx.fillText(linePart, currentX, currentY);
				currentX += ctx.measureText(linePart).width;
				const parsedEmoji = twemoji.parse(lineEmoji[i]);
				if (!parsedEmoji.length || !parsedEmoji[0].url) continue;
				const { body } = await request.get(parsedEmoji[0].url);
				const loadedEmoji = await loadImage(body);
				loadedEmoji.width = emojiSize;
				loadedEmoji.height = emojiSize;
				ctx.drawImage(loadedEmoji, currentX, currentY, emojiSize, emojiSize);
				currentX += emojiSize;
			}
			currentY += metrics.emHeightAscent + metrics.emHeightDescent;
		}
		this.fillHashtags(ctx, wrapped, x, y, emojiSize);
		return ctx;
	}

	fillHashtags(ctx, wrappedText, x, y, emojiSize) {
		let currentY = y;
		for (const line of wrappedText) {
			if (line === '') {
				const metrics = ctx.measureText('a');
				currentY += metrics.emHeightAscent + metrics.emHeightDescent;
				continue;
			}
			const words = line.split(' ');
			for (let i = 0; i < words.length; i++) {
				const word = words[i];
				if (!word.startsWith('#') && !word.startsWith('@')) continue;
				if (word.match(emojiRegex())) continue;
				let preWords = words.slice(0, i).join(' ');
				if (i !== 0) preWords += ' ';
				const emoji = preWords.match(emojiRegex());
				let preLen = ctx.measureText(preWords.replace(emojiRegex(), '')).width;
				if (emoji) preLen += emoji.length * emojiSize;
				const oldStyle = ctx.fillStyle;
				ctx.fillStyle = '#1da1f2';
				ctx.fillText(word, x + preLen, currentY);
				ctx.fillStyle = oldStyle;
			}
			const metrics = ctx.measureText(line);
			currentY += metrics.emHeightAscent + metrics.emHeightDescent;
		}
		return ctx;
	}

	async fetchUser(user) {
		try {
			const guestClient = await api.getGuestClient();
			const { data } = await guestClient.getUserApi().getUserByScreenName({ screenName: user });
			const body = data.user.legacy;
			const avatarRes = await request.get(body.profileImageUrlHttps);
			let checkType = null;
			if (body.verifiedType === 'Government') checkType = 'gov';
			else if (body.verifiedType === 'Business') checkType = 'business';
			else if (data.user.isBlueVerified) checkType = 'blue';
			const label = data.user.affiliatesHighlightedLabel.label?.badge?.url;
			return {
				screenName: body.screenName,
				name: body.name,
				avatar: avatarRes.body,
				avatarShape: data.user.profileImageShape,
				label,
				checkType,
				followers: body.followersCount
			};
		} catch (err) {
			const defaultPfp = await readFile(path.join(__dirname, '..', '..', 'assets', 'images', 'tweet', 'default.png'));
			return {
				screenName: user,
				name: 'Unknown User',
				avatar: defaultPfp,
				avatarShape: 'Circle',
				checkType: null,
				label: null,
				followers: 5,
				err
			};
		}
	}
};
