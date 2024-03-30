const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class DistractedBoyfriendCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'distracted-boyfriend',
			aliases: ['man-looking-at-other-woman', 'jealous-girlfriend', 'distracted-bf', 'jealous-gf'],
			group: 'edit-meme',
			memberName: 'distracted-boyfriend',
			description: 'Draws three user\'s avatars over the "Distracted Boyfriend" meme.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Antonio Guillem',
					url: 'http://antonioguillem.com/',
					reason: 'Image',
					reasonURL: 'https://www.istockphoto.com/photo/gm493656728-77018851'
				}
			],
			args: [
				{
					key: 'otherGirl',
					label: 'other girl',
					prompt: 'Which user should be the "other girl"?',
					type: 'user'
				},
				{
					key: 'girlfriend',
					prompt: 'Which user should be the girlfriend?',
					type: 'user'
				},
				{
					key: 'boyfriend',
					prompt: 'Which user should be the boyfriend?',
					type: 'user'
				}
			]
		});
	}

	async run(msg, { otherGirl, girlfriend, boyfriend }) {
		const boyfriendAvatarURL = boyfriend.displayAvatarURL({ format: 'png', size: 256 });
		const girlfriendAvatarURL = girlfriend.displayAvatarURL({ format: 'png', size: 256 });
		const otherGirlAvatarURL = otherGirl.displayAvatarURL({ format: 'png', size: 256 });
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'distracted-boyfriend.png'));
		const boyfriendAvatarData = await request.get(boyfriendAvatarURL);
		const boyfriendAvatar = await loadImage(boyfriendAvatarData.body);
		const girlfriendAvatarData = await request.get(girlfriendAvatarURL);
		const girlfriendAvatar = await loadImage(girlfriendAvatarData.body);
		const otherGirlAvatarData = await request.get(otherGirlAvatarURL);
		const otherGirlAvatar = await loadImage(otherGirlAvatarData.body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.rotate(-18.06 * (Math.PI / 180));
		ctx.drawImage(boyfriendAvatar, 290, 165, 125, 125);
		ctx.rotate(18.06 * (Math.PI / 180));
		ctx.rotate(3.11 * (Math.PI / 180));
		ctx.drawImage(girlfriendAvatar, 539, 67, 100, 125);
		ctx.rotate(-3.11 * (Math.PI / 180));
		ctx.drawImage(otherGirlAvatar, 120, 96, 175, 175);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'distracted-boyfriend.png' }] });
	}
};
