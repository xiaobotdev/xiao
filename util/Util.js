const crypto = require('crypto');
const yes = ['yes', 'y', 'ye', 'yeah', 'yup', 'yea', 'ya'];
const no = ['no', 'n', 'nah', 'nope', 'nop'];

module.exports = class Util {
	static delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
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

	static randomRange(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	static trimArray(arr, maxLen = 10) {
		if (arr.length > maxLen) {
			const len = arr.length - maxLen;
			arr = arr.slice(0, maxLen);
			arr.push(`${len} more...`);
		}
		return arr;
	}

	static removeDuplicates(arr) {
		if (arr.length === 0 || arr.length === 1) return arr;
		const newArr = [];
		for (let i = 0; i < arr.length; i++) {
			if (newArr.includes(arr[i])) continue;
			newArr.push(arr[i]);
		}
		return newArr;
	}

	static sortByName(arr, prop) {
		return arr.sort((a, b) => {
			if (prop) return a[prop].toLowerCase() > b[prop].toLowerCase() ? 1 : -1;
			return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
		});
	}

	static firstUpperCase(text, split = ' ') {
		return text.split(split).map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join(' ');
	}

	static formatNumber(number) {
		return Number.parseFloat(number).toLocaleString(undefined, { maximumFractionDigits: 2 });
	}

	static base64(text, mode = 'encode') {
		if (mode === 'encode') return Buffer.from(text).toString('base64');
		if (mode === 'decode') return Buffer.from(text, 'base64').toString('utf8') || null;
		throw new TypeError(`${mode} is not a supported base64 mode.`);
	}

	static hash(text, algorithm) {
		return crypto.createHash(algorithm).update(text).digest('hex');
	}

	static streamToArray(stream) {
		if (!stream.readable) return Promise.resolve([]);
		return new Promise((resolve, reject) => {
			const array = [];
			function onData(data) {
				array.push(data);
			}
			function onEnd(error) {
				if (error) reject(error);
				else resolve(array);
				cleanup();
			}
			function onClose() {
				resolve(array);
				cleanup();
			}
			function cleanup() {
				stream.removeListener('data', onData);
				stream.removeListener('end', onEnd);
				stream.removeListener('error', onEnd);
				stream.removeListener('close', onClose);
			}
			stream.on('data', onData);
			stream.on('end', onEnd);
			stream.on('error', onEnd);
			stream.on('close', onClose);
		});
	}

	static today(timeZone) {
		const now = new Date();
		if (timeZone) now.setUTCHours(timeZone);
		now.setHours(0);
		now.setMinutes(0);
		now.setSeconds(0);
		now.setMilliseconds(0);
		return now;
	}

	static tomorrow(timeZone) {
		const today = Util.today(timeZone);
		today.setDate(today.getDate() + 1);
		return today;
	}

	static async verify(channel, user, time = 30000) {
		const filter = res => {
			const value = res.content.toLowerCase();
			return (user ? res.author.id === user.id : true) && (yes.includes(value) || no.includes(value));
		};
		const verify = await channel.awaitMessages(filter, {
			max: 1,
			time
		});
		if (!verify.size) return 0;
		const choice = verify.first().content.toLowerCase();
		if (yes.includes(choice)) return true;
		if (no.includes(choice)) return false;
		return false;
	}

	static cleanAnilistHTML(html) {
		let clean = html
			.replace(/(<br>)+/g, '\n')
			.replace(/&#039;/g, '\'')
			.replace(/&quot;/g, '"')
			.replace(/<\/?i>/g, '*')
			.replace(/~!|!~/g, '||')
			.replace(/&mdash;/g, '—');
		if (clean.length > 2000) clean = `${clean.substr(0, 1995)}...`;
		const spoilers = (clean.match(/\|\|/g) || []).length;
		if (spoilers !== 0 && (spoilers && (spoilers % 2))) clean += '||';
		return clean;
	}
};
