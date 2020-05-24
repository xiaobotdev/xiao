const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const moment = require('moment');
const request = require('node-superfetch');
const path = require('path');
const { base64 } = require('../../util/Util');
const { wrapText } = require('../../util/Canvas');
const { TWITTER_KEY, TWITTER_SECRET } = process.env;
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Bold.ttf'), { family: 'Noto', weight: 'bold' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class TweetCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tweet',
			aliases: ['fake-tweet', 'twitter-tweet', 'fake-twitter-tweet'],
			group: 'edit-image',
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
					prompt: 'What should the text of the achievement be?',
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
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'tweet.png'));
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			const likes = Math.floor(Math.random() * 999999) + 1;
			const retweets = Math.floor(Math.random() * 999999) + 1;
			const replies = Math.floor(Math.random() * 999999) + 1;
			ctx.drawImage(base, 0, 0);
			ctx.textBaseline = 'top';
			ctx.font = 'normal bold 18px Noto';
			ctx.fillStyle = 'white';
			ctx.fillText(userData.name, 105, 95);
			ctx.font = '17px Noto';
			ctx.fillStyle = '#8899a6';
			ctx.fillText(userData.screenName, 106, 118);
			ctx.fillStyle = 'white';
			ctx.font = '23px Noto';
			const lines = await wrapText(ctx, text, 710);
			ctx.fillText(lines.join('\n'), 32, 171);
			ctx.fillStyle = '#8899a6';
			ctx.font = '18px Noto';
			ctx.fillText(moment().format('h:mm A ∙ MMMM D, YYYY'), 31, 282);
			ctx.font = '16px Noto';
			ctx.fillText(this.formatNumber(replies), 87, 470);
			ctx.fillText(this.formatNumber(likes), 509, 470);
			ctx.fillText(this.formatNumber(retweets), 300, 470);
			ctx.fillStyle = 'white';
			ctx.font = 'normal bold 18px Noto';
			ctx.fillText(this.formatNumber(retweets), 31, 407);
			const retweetsLen = ctx.measureText(this.formatNumber(retweets));
			ctx.fillStyle = '#8899a6';
			ctx.font = '18px Noto';
			ctx.fillText('Retweets', 31 + retweetsLen + 5, 407);
			const retweetsWordLen = ctx.measureText('Retweets');
			ctx.fillStyle = 'white';
			ctx.font = 'normal bold 18px Noto';
			ctx.fillText(this.formatNumber(likes), 31 + retweetsLen + 5 + retweetsWordLen + 10, 407);
			const likesLen = ctx.measureText(this.formatNumber(likes));
			ctx.fillStyle = '#8899a6';
			ctx.font = '18px Noto';
			ctx.fillText('Likes', 31 + retweetsLen + 5 + retweetsWordLen + 10 + likesLen + 5, 407);
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
		try {
			const { body } = await request
				.get('https://api.twitter.com/1.1/users/show.json')
				.set({ Authorization: `Bearer ${this.token}` })
				.query({ screen_name: user });
			const avatarRes = await request.get(body.profile_image_url_https);
			return {
				screenName: body.screen_name,
				name: body.name,
				avatar: avatarRes.body,
				verified: body.verified
			};
		} catch {
			const avatarRes = await request.get(msg.author.displayAvatarURL({ format: 'png', size: 64 }));
			return {
				screenName: msg.author.username.slice(0, 15),
				name: msg.member ? msg.member.displayName.slice(0, 50) : msg.author.username.slice(0, 50),
				avatar: avatarRes.body,
				verified: false
			};
		}
	}

	formatNumber(number) {
		return number > 999 ? `${(number / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}K` : number;
	}
};
