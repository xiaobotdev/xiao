const snekfetch = require('snekfetch');
const { promisify } = require('util');
const { DBOTS_KEY, DBOTSORG_KEY } = process.env;

class Util {
	static postStats(count, id) {
		snekfetch
			.post(`https://bots.discord.pw/api/bots/${id}/stats`)
			.set({ Authorization: DBOTS_KEY })
			.send({ server_count: count })
			.catch(err => console.error(`[DBOTS] Failed to post to Discord Bots. ${err}`));
		snekfetch
			.post(`https://discordbots.org/api/bots/${id}/stats`)
			.set({ Authorization: DBOTSORG_KEY })
			.send({ server_count: count })
			.catch(err => console.error(`[DBOTSORG] Failed to post to Discord Bots Org. ${err}`));
	}

	static wait(time) {
		return promisify(setTimeout)(time);
	}

	static shuffle(array) {
		const arr = array.slice(0);
		for (let i = arr.length - 1; i >= 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const temp = arr[i];
			arr[i] = arr[j];
			arr[j] = temp;
		}
		return arr;
	}

	static list(arr, conj = 'and') {
		const len = arr.length;
		return `${arr.slice(0, -1).join(', ')}${len > 1 ? `${len > 2 ? ',' : ''} ${conj} ` : ''}${arr.slice(-1)}`;
	}

	static shorten(text, maxLen = 2000) {
		return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text;
	}

	static filterPkmn(arr) {
		const filtered = arr.filter(entry => entry.language.name === 'en');
		return filtered[Math.floor(Math.random() * filtered.length)];
	}

	static duration(ms) {
		const sec = Math.floor((ms / 1000) % 60);
		const min = Math.floor((ms / (1000 * 60)) % 60);
		const hrs = Math.floor(ms / (1000 * 60 * 60));
		return {
			hours: hrs,
			minutes: min,
			seconds: sec,
			format: () => `${hrs < 10 ? `0${hrs}` : hrs}:${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`
		};
	}

	static pad(text, prefix) {
		return `${prefix.slice(text.length)}${text}`;
	}

	static greyscale(ctx, x, y, width, height) {
		const data = ctx.getImageData(x, y, width, height);
		for (let i = 0; i < data.data.length; i += 4) {
			const brightness = (0.34 * data.data[i]) + (0.5 * data.data[i + 1]) + (0.16 * data.data[i + 2]);
			data.data[i] = brightness;
			data.data[i + 1] = brightness;
			data.data[i + 2] = brightness;
		}
		ctx.putImageData(data, x, y);
		return ctx;
	}

	static invert(ctx, x, y, width, height) {
		const data = ctx.getImageData(x, y, width, height);
		for (let i = 0; i < data.data.length; i += 4) {
			data.data[i] = 255 - data.data[i];
			data.data[i + 1] = 255 - data.data[i + 1];
			data.data[i + 2] = 255 - data.data[i + 2];
		}
		ctx.putImageData(data, x, y);
		return ctx;
	}

	static silhouette(ctx, x, y, width, height) {
		const data = ctx.getImageData(x, y, width, height);
		for (let i = 0; i < data.data.length; i += 4) {
			data.data[i] = 0;
			data.data[i + 1] = 0;
			data.data[i + 2] = 0;
		}
		ctx.putImageData(data, x, y);
		return ctx;
	}

	static sepia(ctx, x, y, width, height) {
		const data = ctx.getImageData(x, y, width, height);
		for (let i = 0; i < data.data.length; i += 4) {
			const brightness = (0.34 * data.data[i]) + (0.5 * data.data[i + 1]) + (0.16 * data.data[i + 2]);
			data.data[i] = brightness + 100;
			data.data[i + 1] = brightness + 50;
			data.data[i + 2] = brightness;
		}
		ctx.putImageData(data, x, y);
		return ctx;
	}
}

module.exports = Util;
