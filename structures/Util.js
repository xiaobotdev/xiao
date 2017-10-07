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

	static cleanHTML(text) {
		return text
			.replace(/&amp;/g, '&')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&quot;/g, '"')
			.replace(/&ndash;/g, '–')
			.replace(/&mdash;/g, '—')
			.replace(/&copy;/g, '©')
			.replace(/&trade;/g, '™')
			.replace(/&reg;/g, '®');
	}
}

module.exports = Util;
