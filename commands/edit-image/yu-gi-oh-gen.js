const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { list, firstUpperCase } = require('../../util/Util');
const { wrapText } = require('../../util/Canvas');
const types = ['monster', 'spell', 'trap'];
const monsterTypes = ['normal', 'effect', 'fusion', 'synchro', 'xyz', 'link', 'token'];
const atrs = ['dark', 'divine', 'earth', 'fire', 'laugh', 'light', 'water', 'wind'];
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Matrix Book.ttf'), { family: 'Matrix Book' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Matrix Small Caps.ttf'), { family: 'Matrix' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Stone Serif.ttf'), { family: 'Stone Serif' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Stone Serif Small Caps.ttf'), {
	family: 'Stone Serif Small Caps'
});

module.exports = class YuGiOhGenCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'yu-gi-oh-gen',
			aliases: ['ygo-gen', 'yu-gi-oh-generator', 'ygo-generator'],
			group: 'edit-image',
			memberName: 'yu-gi-oh-gen',
			description: 'Draws an image or a user\'s avatar on a Yu-Gi-Oh! Trading Card with the text of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Konami',
					url: 'https://www.konami.com/en/',
					reason: 'Images, Original "Yu-Gi-Oh!" Game',
					reasonURL: 'https://www.yugioh-card.com/en/'
				},
				{
					name: 'sl777123',
					url: 'https://www.deviantart.com/sl777123',
					reason: 'Card Base Templates',
					reasonURL: 'https://www.deviantart.com/sl777123/art/Normals-711959461'
				},
				{
					name: 'icycatelf',
					url: 'https://www.deviantart.com/icycatelf',
					reason: 'Level/Rank Star Image',
					reasonURL: 'https://www.deviantart.com/icycatelf/art/Level-Star-Template-PSD-607344453'
				},
				{
					name: 'bushin',
					url: 'https://www.cardmaker.net/profile/220983-bushin/',
					reason: 'Fonts',
					// eslint-disable-next-line max-len
					reasonURL: 'https://www.cardmaker.net/forums/topic/308603-fonts-for-yu-gi-oh-card-making-with-multilingual-support/'
				}
			],
			args: [
				{
					key: 'type',
					prompt: `What type of card do you want to make? Either ${list(types, 'or')}.`,
					type: 'string',
					oneOf: types,
					parse: type => type.toLowerCase()
				},
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 1024 })
				}
			]
		});
	}

	async run(msg, { type, image }) {
		const id = Math.floor(Math.random() * 100000000);
		const setID = Math.floor(Math.random() * 1000);
		try {
			const monsterType = await this.determineMonsterType(msg, type);
			if (!monsterType) return msg.say('Aborted card creation.');
			const name = await this.determineName(msg);
			if (!name) return msg.say('Aborted card creation.');
			const attribute = await this.determineAttribute(msg, type);
			if (!attribute) return msg.say('Aborted card creation.');
			const species = await this.determineType(msg, type);
			if (!species) return msg.say('Aborted card creation.');
			const effect = await this.determineEffect(msg, monsterType);
			if (!effect) return msg.say('Aborted card creation.');
			const level = await this.determineLevel(msg, type, monsterType);
			if (!level) return msg.say('Aborted card creation.');
			const atk = await this.determineAttack(msg, type);
			if (!atk) return msg.say('Aborted card creation.');
			const def = await this.determineDefense(msg, type, monsterType);
			if (!def) return msg.say('Aborted card creation.');
			const base = await loadImage(
				path.join(__dirname, '..', '..', 'assets', 'images', 'yu-gi-oh-gen', 'bases', `${monsterType}.png`)
			);
			const atr = await loadImage(
				path.join(__dirname, '..', '..', 'assets', 'images', 'yu-gi-oh-gen', 'atrs', `${attribute}.png`)
			);
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, base.width, base.height);
			const height = 617 / data.width;
			ctx.drawImage(data, 98, 217, 617, data.height * height);
			ctx.drawImage(base, 0, 0);
			ctx.drawImage(atr, 686, 55 + (monsterType === 'link' ? 4 : 0), 70, 70);
			if (level > 0) {
				const levelToUse = monsterType === 'xyz' ? 'rank' : 'level';
				const levelI = await loadImage(
					path.join(__dirname, '..', '..', 'assets', 'images', 'yu-gi-oh-gen', `${levelToUse}.png`)
				);
				for (let i = 0; i < level; i++) {
					let levelX;
					if (monsterType === 'xyz') levelX = 76 + (50 * i) + (5 * i);
					else levelX = 686 - (50 * i) - (5 * i);
					ctx.drawImage(levelI, levelX, 141, 50, 50);
				}
			}
			ctx.font = '14px Noto';
			ctx.fillStyle = monsterType === 'xyz' || monsterType === 'link' ? 'white' : 'black';
			ctx.textBaseline = 'top';
			ctx.font = '87px Matrix';
			ctx.fillText(name, 60, 57, 620);
			ctx.fillStyle = 'black';
			if (type === 'monster') {
				ctx.font = '31px Stone Serif Small Caps';
				let typeStr = `[ ${firstUpperCase(species)} / ${firstUpperCase(monsterType)}`;
				if (monsterType !== 'normal' && monsterType !== 'effect' && monsterType !== 'token') {
					typeStr += ' / Effect';
				}
				typeStr += ' ]';
				ctx.fillText(typeStr, 60, 894);
				ctx.font = '29px Stone Serif';
				ctx.fillText(atk, 514, 1079);
				ctx.fillText(def, monsterType === 'link' ? 722 : 675, 1079);
			} else if (type === 'spell') {
				ctx.font = '35px Stone Serif Small Caps';
				ctx.fillText('[ Spell Card ]', 479, 141);
			} else if (type === 'trap') {
				ctx.font = '35px Stone Serif Small Caps';
				ctx.fillText('[ Trap Card ]', 489, 141);
			}
			ctx.font = '27px Matrix Book';
			const wrappedEffect = await wrapText(ctx, effect, 690);
			ctx.fillText(wrappedEffect.join('\n'), 63, 930 - (type === 'monster' ? 0 : 31));
			ctx.font = '22px Stone Serif';
			ctx.fillStyle = monsterType === 'xyz' ? 'white' : 'black';
			ctx.fillText(id.toString().padStart(8, '0'), 43, 1128);
			ctx.fillText(`XIAO-EN${setID.toString().padStart(3, '0')}`, 589 - (monsterType === 'link' ? 58 : 0), 849);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'yu-gi-oh-gen.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async determineMonsterType(msg, type) {
		if (type !== 'monster') return type;
		await msg.reply(`What kind of monster do you want to make? Either ${list(monsterTypes, 'or')}.`);
		const filter = res => res.author.id === msg.author.id && monsterTypes.includes(res.content.toLowerCase());
		const msgs = await msg.channel.awaitMessages(filter, {
			max: 1,
			time: 60000
		});
		if (!msgs.size) return null;
		return msgs.first().content.toLowerCase();
	}

	async determineName(msg) {
		await msg.reply('What name should your card have?');
		const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
			max: 1,
			time: 60000
		});
		if (!msgs.size) return null;
		return msgs.first().content;
	}

	async determineAttribute(msg, type) {
		if (type !== 'monster') return type;
		await msg.reply(`What attribute should your monster be? Either ${list(atrs, 'or')}.`);
		const filter = res => res.author.id === msg.author.id && atrs.includes(res.content.toLowerCase());
		const msgs = await msg.channel.awaitMessages(filter, {
			max: 1,
			time: 60000
		});
		if (!msgs.size) return null;
		return msgs.first().content.toLowerCase();
	}

	async determineType(msg, type) {
		if (type !== 'monster') return type;
		await msg.reply('What type should your monster be? For example, "Dragon".');
		const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
			max: 1,
			time: 60000
		});
		if (!msgs.size) return null;
		return msgs.first().content;
	}

	async determineEffect(msg, monsterType) {
		if (monsterType === 'token') return 'This card can be used as any Token.';
		await msg.reply('What effect should your card have?');
		const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
			max: 1,
			time: 60000
		});
		if (!msgs.size) return null;
		return msgs.first().content;
	}

	async determineLevel(msg, type, monsterType) {
		if (type !== 'monster' || monsterType === 'link') return -1;
		await msg.reply(`What ${monsterType === 'xyz' ? 'rank' : 'level'} should your monster be? From 0-12.`);
		const filter = res => {
			if (res.author.id !== msg.author.id) return false;
			const int = Number.parseInt(res.content, 10);
			return int >= 0 && int <= 12;
		};
		const msgs = await msg.channel.awaitMessages(filter, {
			max: 1,
			time: 60000
		});
		if (!msgs.size) return null;
		return msgs.first().content;
	}

	async determineAttack(msg, type) {
		if (type !== 'monster') return -1;
		await msg.reply('How much attack should your monster have? From 0-9999.');
		const filter = res => {
			if (res.author.id !== msg.author.id) return false;
			const int = Number.parseInt(res.content, 10);
			return int >= 0 && int <= 9999;
		};
		const msgs = await msg.channel.awaitMessages(filter, {
			max: 1,
			time: 60000
		});
		if (!msgs.size) return null;
		return msgs.first().content;
	}

	async determineDefense(msg, type, monsterType) {
		if (type !== 'monster') return -1;
		if (monsterType === 'link') await msg.reply('What link rating should your monster have? From 0-8.');
		else await msg.reply('How much defense should your monster have? From 0-9999.');
		const filter = res => {
			if (res.author.id !== msg.author.id) return false;
			const int = Number.parseInt(res.content, 10);
			return int >= 0 && int <= (monsterType === 'link' ? 8 : 9999);
		};
		const msgs = await msg.channel.awaitMessages(filter, {
			max: 1,
			time: 60000
		});
		if (!msgs.size) return null;
		return msgs.first().content;
	}
};
