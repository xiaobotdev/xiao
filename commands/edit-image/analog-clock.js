const Command = require('../../structures/Command');
const { createCanvas } = require('canvas');
const moment = require('moment-timezone');
const { firstUpperCase } = require('../../util/Util');

module.exports = class AnalogClockCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'analog-clock',
			aliases: ['analog-time', 'analog-time-zone', 'clock', 'analog'],
			group: 'edit-image',
			memberName: 'analog-clock',
			description: 'Draws an analog clock for a timezone.',
			details: '**Zones:** <https://en.wikipedia.org/wiki/List_of_tz_database_time_zones>',
			credit: [
				{
					name: 'Wikipedia',
					url: 'https://www.wikipedia.org/',
					reason: 'Time Zone Data',
					reasonURL: 'https://en.wikipedia.org/wiki/List_of_tz_database_time_zones'
				},
				{
					name: 'Neopets',
					url: 'http://www.neopets.com/',
					reason: 'Neopia Time Zone'
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
					key: 'timeZone',
					label: 'time zone',
					prompt: 'Which time zone do you want to get the time of?',
					type: 'timezone'
				}
			]
		});
	}

	run(msg, { timeZone }) {
		const time = moment().tz(timeZone);
		const location = timeZone.split('/');
		const main = firstUpperCase(location[0], /[_ ]/);
		const sub = location[1] ? firstUpperCase(location[1], /[_ ]/) : null;
		const subMain = location[2] ? firstUpperCase(location[2], /[_ ]/) : null;
		const parens = sub ? ` (${subMain ? `${sub}, ` : ''}${main})` : '';
		const canvas = createCanvas(1000, 1000);
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		let radius = canvas.height / 2;
		this.drawMeridiem(ctx, radius, time.format('A'));
		ctx.translate(radius, radius);
		radius *= 0.9;
		this.drawFace(ctx, radius);
		this.drawNumbers(ctx, radius);
		this.drawTime(ctx, radius, time);
		return msg.say(`${subMain || sub || main}${parens}`, {
			files: [{ attachment: canvas.toBuffer(), name: 'analog-clock.png' }]
		});
	}

	drawFace(ctx, radius) {
		ctx.beginPath();
		ctx.arc(0, 0, radius, 0, 2 * Math.PI);
		ctx.fillStyle = 'white';
		ctx.fill();
		const grad = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
		grad.addColorStop(0, '#333');
		grad.addColorStop(0.5, 'white');
		grad.addColorStop(1, '#333');
		ctx.strokeStyle = grad;
		ctx.lineWidth = radius * 0.1;
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
		ctx.fillStyle = '#333';
		ctx.fill();
		return ctx;
	}

	drawNumbers(ctx, radius) {
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(radius * 0.15);
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';
		for (let num = 1; num < 13; num++) {
			const ang = (num * Math.PI) / 6;
			ctx.rotate(ang);
			ctx.translate(0, -radius * 0.85);
			ctx.rotate(-ang);
			ctx.fillText(num.toString(), 0, 0);
			ctx.rotate(ang);
			ctx.translate(0, radius * 0.85);
			ctx.rotate(-ang);
		}
		return ctx;
	}

	drawMeridiem(ctx, radius, meridiem) {
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(radius * 0.15);
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';
		ctx.fillStyle = 'white';
		ctx.fillText(meridiem, ctx.canvas.width - 100, ctx.canvas.height - 75);
		return ctx;
	}

	drawTime(ctx, radius, time) {
		let hour = time.hours() % 12;
		let minute = time.minutes();
		let second = time.seconds();
		hour = (hour * (Math.PI / 6)) + ((minute * Math.PI) / (6 * 60)) + ((second * Math.PI) / (360 * 60));
		this.drawHand(ctx, hour, radius * 0.5, radius * 0.07);
		minute = (minute * (Math.PI / 30)) + ((second * Math.PI) / (30 * 60));
		this.drawHand(ctx, minute, radius * 0.8, radius * 0.07);
		second *= Math.PI / 30;
		this.drawHand(ctx, second, radius * 0.9, radius * 0.02);
		return ctx;
	}

	drawHand(ctx, pos, length, width) {
		ctx.beginPath();
		ctx.lineWidth = width;
		ctx.lineCap = 'round';
		ctx.moveTo(0, 0);
		ctx.rotate(pos);
		ctx.lineTo(0, -length);
		ctx.stroke();
		ctx.rotate(-pos);
		return ctx;
	}
};
