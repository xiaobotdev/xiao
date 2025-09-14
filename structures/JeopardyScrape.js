const request = require('node-superfetch');
const cheerio = require('cheerio');
const fs = require('fs');
const raji = require('raji');
const path = require('path');
const { checkFileExists } = require('../util/Util');
const rounds = ['jeopardy_round', 'double_jeopardy_round', 'final_jeopardy_round'];

module.exports = class JeopardyScrape {
	constructor() {
		this.clues = [];
		this.gameIDs = [];
		this.seasons = [];
		this.imported = false;
	}

	async fetchSeasons() {
		const { text } = await request.get(`https://j-archive.com/listseasons.php`);
		const $ = cheerio.load(text);
		const seasons = [];
		$('table td a').each((j, elem) => {
			const href = $(elem).attr('href');
			seasons.push(href.split('season=')[1]);
		});
		return seasons.reverse();
	}

	async fetchSeason(season) {
		const { text } = await request.get(`https://j-archive.com/showseason.php`)
			.query({ season });
		const $ = cheerio.load(text);
		const gameIDs = [];
		$('table td a').each((j, elem) => {
			const href = $(elem).attr('href');
			gameIDs.push(href.split('id=')[1]);
		});
		return gameIDs;
	}

	async fetchClues(id) {
		const { text } = await request.get('http://www.j-archive.com/showgame.php')
			.query({ game_id: id });
		const $ = cheerio.load(text);
		const clues = [];
		for (const round of rounds) {
			const questions = $(`#${round} .clue`);
			const categories = $(`#${round} .category_name`);
			const categoryArr = [];
			categories.each((i, elem) => categoryArr.push($(elem).text().toLowerCase()));
			questions.each((i, elem) => {
				let value = $(elem).find('td[class="clue_value"]').text();
				if (!value) value = $(elem).find('td[class="clue_value_daily_double"]').text();
				const question = $(elem).find('td[class="clue_text"]').first().text();
				const answer = $(elem).find('em[class="correct_response"]').text();
				if (!question || !answer) return;
				clues.push({
					question,
					answer,
					category: categoryArr[i % 6],
					value: value ? value.match(/[0-9]+/)[0] : '0',
					gameID: id
				});
			});
		}
		return clues;
	}

	async importData() {
		const read = await fs.promises.readFile(path.join(__dirname, '..', 'jeopardy.json'), { encoding: 'utf8' });
		const file = await raji.parse(read);
		if (typeof file !== 'object' || Array.isArray(file)) return null;
		if (!file.clues || !file.gameIDs || !file.seasons) return null;
		for (const season of file.seasons) {
			if (typeof season !== 'string') continue;
			if (this.seasons.includes(season)) continue;
			this.seasons.push(season);
		}
		for (const gameID of file.gameIDs) {
			if (typeof gameID !== 'string') continue;
			if (this.gameIDs.includes(gameID)) continue;
			this.gameIDs.push(gameID);
		}
		for (const clue of file.clues) {
			if (typeof clue !== 'object' || Array.isArray(clue)) continue;
			if (this.clues.some(c => c.question === clue.question && c.answer === clue.answer)) continue;
			this.clues.push(clue);
		}
		this.imported = true;
		return file;
	}

	exportData() {
		const buf = Buffer.from(JSON.stringify({
			clues: this.clues,
			gameIDs: this.gameIDs,
			seasons: this.seasons
		}));
		fs.writeFileSync(path.join(__dirname, '..', 'jeopardy.json'), buf, { encoding: 'utf8' });
		return buf;
	}

	async checkForUpdates() {
		if (!this.imported) {
			const fileExists = await checkFileExists(path.join(__dirname, '..', 'jeopardy.json'));
			if (fileExists) await this.importData();
		}
		const cluesBefore = this.clues.length;
		const latestSeason = this.seasons[this.seasons.length - 1];
		const seasons = await this.fetchSeasons();
		for (const season of seasons) {
			if (this.seasons.includes(season) && latestSeason !== season) continue;
			if (latestSeason !== season) this.seasons.push(season);
			const games = await this.fetchSeason(season);
			for (const gameID of games) {
				if (this.gameIDs.includes(gameID)) continue;
				this.gameIDs.push(gameID);
				const clues = await this.fetchClues(gameID);
				this.clues.push(...clues);
			}
		}
		this.exportData();
		return this.clues.length - cluesBefore;
	}
};
