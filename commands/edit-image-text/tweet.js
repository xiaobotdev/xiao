const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const moment = require('moment');
const request = require('node-superfetch');
const path = require('path');
const { base64, formatNumberK, randomRange } = require('../../util/Util');
const { wrapText } = require('../../util/Canvas');
const { TWITTER_KEY, TWITTER_SECRET } = process.env;

module.exports = class TweetCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tweet',
			aliases: ['fake-tweet', 'twitter-tweet', 'fake-twitter-tweet'],
			group: 'edit-image-text',
			memberName: 'tweet',
			description: 'Sends a Twitter tweet with the user and text of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Twitter',
					url: 'https://twitter.com/',
					reason: 'Image, API',
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
					prompt: 'What user should say the tweet? Use the handle, not the name.',
					type: 'string',
					max: 15
				},
				{
					key: 'text',
					prompt: 'What should the text of the tweet be?',
					type: 'string',
					max: 280
				}
			]
		});

		this.token = null;
	}

	async run(msg, { user, text }) {
		try {
			if (!this.token) await this.fetchToken();
			const userData = await this.fetchUser(msg, user);
			const avatar = await loadImage(userData.avatar);
			const base1 = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'tweet', 'bg-1.png'));
			const base2 = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'tweet', 'bg-2.png'));
			const canvas = createCanvas(base1.width, base1.height + base2.height);
			const ctx = canvas.getContext('2d');
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(23);
			const lines = await wrapText(ctx, text, 710);
			const lineBreakLen = text.split('\n').length;
			const linesLen = (23 * lines.length)
				+ (23 * (lineBreakLen - 1))
				+ (9 * (lines.length - 1))
				+ (9 * (lineBreakLen - 1));
			canvas.height += linesLen;
			const likes = randomRange(Math.ceil(userData.followers * 0.0015), Math.ceil(userData.followers * 0.002));
			const retweets = randomRange(Math.ceil(userData.followers * 0.00015), Math.ceil(userData.followers * 0.0002));
			const quoteTweets = randomRange(Math.ceil(userData.followers * 0.000015), Math.ceil(userData.followers * 0.00002));
			const replies = randomRange(Math.ceil(userData.followers * 0.000015), Math.ceil(userData.followers * 0.00002));
			ctx.fillStyle = '#15202b';
			ctx.fillRect(0, base1.height, canvas.width, linesLen);
			ctx.drawImage(base1, 0, 0);
			const base2StartY = base1.height + linesLen;
			ctx.drawImage(base2, 0, base2StartY);
			ctx.textBaseline = 'top';
			ctx.font = this.client.fonts.get('Noto-Bold.ttf').toCanvasString(18);
			ctx.fillStyle = 'white';
			ctx.fillText(userData.name, 105, 84);
			if (userData.verified) {
				const verified = await loadImage(
					path.join(__dirname, '..', '..', 'assets', 'images', 'tweet', 'verified.png')
				);
				const nameLen = ctx.measureText(userData.name).width;
				ctx.drawImage(verified, 105 + nameLen + 4, 88, 18, 18);
			}
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(17);
			ctx.fillStyle = '#8899a6';
			ctx.fillText(`@${userData.screenName}`, 106, 111);
			ctx.fillStyle = 'white';
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(23);
			ctx.fillText(lines.join('\n'), 32, 164);
			ctx.fillStyle = '#8899a6';
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(18);
			const time = moment().format('h:mm A ∙ MMMM D, YYYY ∙');
			ctx.fillText(time, 31, base2StartY + 16);
			const timeLen = ctx.measureText(time).width;
			ctx.fillStyle = '#1b95e0';
			ctx.fillText('Twitter for Xiao', 31 + timeLen + 6, base2StartY + 16);
			ctx.fillStyle = '#8899a6';
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(16);
			ctx.fillText(formatNumberK(replies), 87, base2StartY + 139);
			ctx.fillText(formatNumberK(likes), 509, base2StartY + 139);
			ctx.fillText(formatNumberK(retweets + quoteTweets), 300, base2StartY + 139);
			let currentLen = 31;
			ctx.fillStyle = 'white';
			ctx.font = this.client.fonts.get('Noto-Bold.ttf').toCanvasString(18);
			ctx.fillText(formatNumberK(retweets), currentLen, base2StartY + 77);
			currentLen += ctx.measureText(formatNumberK(retweets)).width;
			currentLen += 5;
			ctx.fillStyle = '#8899a6';
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(18);
			ctx.fillText('Retweets', currentLen, base2StartY + 77);
			currentLen += ctx.measureText('Retweets').width;
			currentLen += 10;
			ctx.fillStyle = 'white';
			ctx.font = this.client.fonts.get('Noto-Bold.ttf').toCanvasString(18);
			ctx.fillText(formatNumberK(quoteTweets), currentLen, base2StartY + 77);
			currentLen += ctx.measureText(formatNumberK(quoteTweets)).width;
			currentLen += 5;
			ctx.fillStyle = '#8899a6';
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(18);
			ctx.fillText('Quote Tweets', currentLen, base2StartY + 77);
			currentLen += ctx.measureText('Quote Tweets').width;
			currentLen += 10;
			ctx.fillStyle = 'white';
			ctx.font = this.client.fonts.get('Noto-Bold.ttf').toCanvasString(18);
			ctx.fillText(formatNumberK(likes), currentLen, base2StartY + 77);
			currentLen += ctx.measureText(formatNumberK(likes)).width;
			currentLen += 5;
			ctx.fillStyle = '#8899a6';
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(18);
			ctx.fillText('Likes', currentLen, base2StartY + 77);
			ctx.beginPath();
			ctx.arc(30 + 32, 84 + 32, 32, 0, Math.PI * 2);
			ctx.closePath();
			ctx.clip();
			ctx.drawImage(avatar, 30, 84, 64, 64);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'tweet.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchToken() {
		const { body } = await request
			.post('https://api.twitter.com/oauth2/token')
			.set({
				Authorization: `Basic ${base64(`${TWITTER_KEY}:${TWITTER_SECRET}`)}`,
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
			})
			.send('grant_type=client_credentials');
		this.token = body.access_token;
		return body;
	}

	async fetchUser(msg, user) {
		if (user.toLowerCase() === 'realdonaldtrump') {
			return {
				screenName: 'realDonaldTrump',
				name: 'Donald J. Trump',
				avatar: path.join(__dirname, '..', '..', 'assets', 'images', 'tweet', 'realdonaldtrump.jpg'),
				verified: true,
				followers: 88776124
			};
		}
		try {
			const { body } = await request
				.get('https://api.twitter.com/1.1/users/show.json')
				.set({ Authorization: `Bearer ${this.token}` })
				.query({ screen_name: user });
			const avatarRes = await request.get(body.profile_image_url_https.replace('_normal', '_bigger'));
			return {
				screenName: body.screen_name,
				name: body.name,
				avatar: avatarRes.body,
				verified: body.verified,
				followers: body.followers_count
			};
		} catch {
			const avatarRes = await request.get(msg.author.displayAvatarURL({ format: 'png', size: 64 }));
			return {
				screenName: msg.author.username.slice(0, 15),
				name: msg.member ? msg.member.displayName.slice(0, 50) : msg.author.username.slice(0, 50),
				avatar: avatarRes.body,
				verified: false,
				followers: 0
			};
		}
	}
};
