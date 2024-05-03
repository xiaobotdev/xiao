const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const moment = require('moment');
const path = require('path');

module.exports = class CertificateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'certificate',
			aliases: ['award', 'certificate-of-excellence', 'cert', 'cert-of-excellence'],
			group: 'edit-image-text',
			memberName: 'certificate',
			description: 'Sends a certificate of excellence with the name and reason of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Creative Certificates',
					url: 'https://www.creativecertificates.com/',
					reason: 'Image',
					reasonURL: 'https://www.creativecertificates.com/award-certificate-templates/'
				},
				{
					name: 'Cheng Xiao',
					url: 'https://www.instagram.com/chengxiao_0715/',
					reason: 'Signature'
				},
				{
					name: 'Monotype',
					url: 'https://www.monotype.com/',
					reason: 'Old English Text MT Font',
					reasonURL: 'https://catalog.monotype.com/family/monotype/monotype-old-english-text'
				}
			],
			args: [
				{
					key: 'reason',
					type: 'string',
					max: 30
				},
				{
					key: 'name',
					type: 'string',
					max: 30,
					default: msg => msg.author.username
				}
			]
		});
	}

	async run(msg, { reason, name }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'certificate.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.font = this.client.fonts.get('oldengl.ttf').toCanvasString(30);
		ctx.textBaseline = 'top';
		ctx.textAlign = 'center';
		ctx.fillText(reason, 518, 273);
		ctx.fillText(name, 518, 419);
		ctx.fillText(moment().format('MM/DD/YYYY'), 309, 503);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'certificate.png' }] });
	}
};
