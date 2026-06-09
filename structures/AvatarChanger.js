const { createCanvas, loadImage } = require('@napi-rs/canvas');
const path = require('path');
const holidayList = require('../assets/json/holiday-list');

module.exports = class AvatarChanger {
	constructor(client) {
		Object.defineProperty(this, 'client', { value: client });

		this.isWearingHat = false;
	}

	async editAvatar(hat) {
		const base = await loadImage(path.join(__dirname, '..', 'assets', 'images', 'Xiao.png'));
		const hatImg = await loadImage(path.join(__dirname, '..', 'assets', 'images', 'hat', `${hat}.png`));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.drawImage(hatImg, 0, 0, base.width, base.height);
		return canvas.toBuffer('image/png');
	}

	async editAvatarBackground(background) {
		const bgImg = await loadImage(path.join(__dirname, '..', 'assets', 'images', `${background}.png`));
		const base = await loadImage(path.join(__dirname, '..', 'assets', 'images', 'XiaoClear.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(bgImg, 0, 0, base.width, base.height);
		ctx.drawImage(base, 0, 0);
		return canvas.toBuffer('image/png');
	}

	async setAvatar(hatOrBackground, type) {
		if (!hatOrBackground) {
			await this.client.redis.db.set('hat', false);
			this.isWearingHat = false;
			await this.client.user.setAvatar(path.join(__dirname, '..', 'assets', 'images', 'Xiao.png'));
			return;
		}
		this.isWearingHat = true;
		await this.client.redis.db.set('hat', true);
		let image;
		if (type === 'background') {
			image = await this.editAvatarBackground(hatOrBackground);
		} else {
			image = await this.editAvatar(hatOrBackground);
		}
		await this.client.user.setAvatar(image);
	}

	async checkForUpdates() {
		const today = new Date();
		const holiday = this.isHoliday(today);
		if (holiday && !this.isWearingHat) {
			let { hat, background } = holiday;
			if (Array.isArray(hat)) hat = hat[Math.floor(Math.random() * hat.length)];
			if (Array.isArray(background)) background = background[Math.floor(Math.random() * background.length)];
			try {
				await this.setAvatar(hat || background, hat ? 'hat' : 'background');
				this.client.logger.info(`[AVATAR] Updated avatar to ${hat}!`);
			} catch (err) {
				this.client.logger.error(`[AVATAR] Failed to update avatar.\n${err.stack}`);
			}
		} else if (this.isWearingHat && !holiday) {
			try {
				await this.setAvatar();
				this.client.logger.info('[AVATAR] Reset avatar to default.');
			} catch (err) {
				this.client.logger.error(`[AVATAR] Failed to update avatar.\n${err.stack}`);
			}
		}
	}

	setInterval() {
		const now = new Date();
		const midnight = new Date(Date.UTC(
			now.getUTCFullYear(),
			now.getUTCMonth(),
			now.getUTCDate() + 1,
			0, 0, 0, 0
		));
		const msUntilNext = midnight - now;
		setTimeout(() => {
			this.checkForUpdates();
			this.setInterval();
		}, msUntilNext);
	}

	get holiday() {
		const today = new Date();
		return this.isHoliday(today) || null;
	}

	isHoliday(day) {
		for (const holiday of holidayList) {
			if (day.getUTCMonth() !== holiday.month - 1) continue;
			if (day.getUTCDate() >= holiday.startDay && day.getUTCDate() <= holiday.endDay) return holiday;
			if (day.getUTCDate() === holiday.day) return holiday;
		}
		if (this.isThanksgiving(day)) {
			return {
				name: 'Thanksgiving',
				hat: 'pilgrim',
				month: day.getUTCMonth(),
				day: day.getUTCDate(),
				activity: 'Happy Thanksgiving!'
			};
		}
		return false;
	}

	isThanksgiving(day) {
		const thanksgiving = this.getThanksgiving(day.getUTCFullYear());
	  	return (
    		day.getUTCFullYear() === thanksgiving.getUTCFullYear()
    		&& day.getUTCMonth() === thanksgiving.getUTCMonth()
    		&& day.getUTCDate() === thanksgiving.getUTCDate()
  		);
	}

	getThanksgiving(year) {
  		const date = new Date(Date.UTC(year, 10, 1));
  		const day = date.getUTCDay();
  		const offset = ((4 - day) + 7) % 7;
  		const firstThursday = 1 + offset;
  		const thanksgiving = firstThursday + 21;
		return new Date(Date.UTC(year, 10, thanksgiving));
	}
};
