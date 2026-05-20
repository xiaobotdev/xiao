const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { createCanvas } = require('@napi-rs/canvas');

module.exports = class NamePopularityCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'name-popularity',
			aliases: ['name-popular', 'popular-name', 'popularity-name', 'name-pop', 'pop-name'],
			group: 'analyze',
			description: 'Responds with how popular a name is in the United States.',
			args: [
				{
					key: 'name',
					type: 'string',
					max: 32
				}
			],
			credit: [
				{
					name: 'NameTrends.net',
					url: 'https://nametrends.net/',
					reason: 'API'
				},
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Noto Font',
					reasonURL: 'https://fonts.google.com/noto'
				}
			]
		});
	}

	async run(msg, { name }) {
		const { text } = await request.get('https://nametrends.net/chartdata/getfrequencyjson.php')
			.query({ name });
		const body = JSON.parse(text);
		if (!body.rows.length) return msg.say('That name isn\'t popular enough in the United States to have data.');
		const years = body.rows.map(row => row.c[0].v);
		const female = body.rows.map(row => row.c[2].v);
		const male = body.rows.map(row => row.c[4].v);
		const minYear = Math.min(...years);
		const maxYear = Math.max(...years);
		const maxValue = Math.max(...female, ...male);
		const width = 1400;
		const height = 700;
		const margin = 70;
		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, width, height);
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(margin, height - margin);
		ctx.lineTo(width - margin, height - margin);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(margin, margin);
		ctx.lineTo(margin, height - margin);
		ctx.stroke();
		const maxF = Math.max(...female);
		const maxM = Math.max(...male);
		const bottom = maxF >= maxM ? 'M' : 'F';
		const pink = 'rgba(255, 105, 180, 1)';
		const blue = 'rgba(80, 140, 255, 1)';
		if (bottom === 'M') {
			this.drawArea(ctx, years, female, pink, width, height, margin, minYear, maxYear, maxValue);
			this.drawArea(ctx, years, male, blue, width, height, margin, minYear, maxYear, maxValue);
		} else {
			this.drawArea(ctx, years, male, blue, width, height, margin, minYear, maxYear, maxValue);
			this.drawArea(ctx, years, female, pink, width, height, margin, minYear, maxYear, maxValue);
		}
		ctx.fillStyle = 'black';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(20);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		for (let year = Math.ceil(minYear / 20) * 20; year <= maxYear; year += 20) {
    		const x = margin + ((year - minYear) / (maxYear - minYear)) * (width - margin * 2);
    		ctx.fillText(year.toString(), x, height - margin + 10);
		}
		ctx.textAlign = 'right';
		ctx.textBaseline = 'middle';
		const steps = 10;
		for (let i = 0; i <= steps; i++) {
   			const value = (maxValue / steps) * i;
    		const y = height - margin - (value / maxValue) * (height - margin * 2);
    		ctx.fillText(value.toFixed(1), margin - 10, y);
		}
		ctx.save();
		ctx.translate(margin - 70, height / 2);
		ctx.rotate(-Math.PI / 2);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.font = this.client.fonts.get('Noto-Bold.ttf').toCanvasString(20);
		ctx.fillStyle = 'black';
		ctx.fillText('Popularity per thousand', 0, 5);
		ctx.restore();
    	return msg.say('_Note: Popularity data is for the United States._', {
			files: [{ attachment: canvas.toBuffer('image/png'), name: 'chart.png' }]
		});
	}

	drawArea(ctx, years, values, color, width, height, margin, minYear, maxYear, maxValue) {
		const graphWidth = width - margin * 2;
		const graphHeight = height - margin * 2;
		const xScale = year => margin + ((year - minYear) / (maxYear - minYear)) * graphWidth;
		const yScale = value => height - margin - (value / maxValue) * graphHeight;
		ctx.beginPath();
		ctx.moveTo(xScale(years[0]), yScale(values[0]));
		years.forEach((year, i) => {
			ctx.lineTo(xScale(year), yScale(values[i]));
		});
		ctx.lineTo(xScale(years[years.length - 1]), height - margin);
		ctx.lineTo(xScale(years[0]), height - margin);
		ctx.closePath();
		ctx.fillStyle = color;
		ctx.fill();
	}
};
