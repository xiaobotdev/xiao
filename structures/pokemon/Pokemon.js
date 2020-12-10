const request = require('node-superfetch');
const path = require('path');
const { removeDuplicates, firstUpperCase } = require('../../util/Util');
const missingno = require('../../assets/json/missingno');

module.exports = class Pokemon {
	constructor(store, data) {
		this.store = store;
		this.id = data.id;
		const slugName = firstUpperCase(data.name).replaceAll('-', ' ');
		this.name = data.names.length
			? data.names.find(entry => entry.language.name === 'en').name
			: slugName;
		this.entries = removeDuplicates(data.flavor_text_entries
			.filter(entry => entry.language.name === 'en')
			.map(entry => entry.flavor_text.replace(/\n|\f|\r/g, ' ')));
		this.names = data.names.length
			? data.names.map(entry => ({ name: entry.name, language: entry.language.name }))
			: [{ name: slugName, language: 'en' }];
		this.genus = data.genera.length
			? `The ${data.genera.filter(entry => entry.language.name === 'en')[0].genus}`
			: 'Undiscovered Pokémon';
		this.genderRate = {
			male: data.gender_rate === -1 ? 0 : 100 - ((data.gender_rate / 8) * 100),
			female: data.gender_rate === -1 ? 0 : (data.gender_rate / 8) * 100,
			genderless: data.gender_rate === -1
		};
		this.legendary = data.is_legendary;
		this.mythical = data.is_mythical;
		this.baby = data.is_baby;
		this.heldItems = data.missingno ? data.heldItems : [];
		this.varieties = data.varieties.map(variety => {
			const name = firstUpperCase(variety.pokemon.name
				.replace(new RegExp(`${this.slug}-?`, 'i'), '')
				.replaceAll('-', ' '));
			return {
				id: variety.pokemon.name,
				name: name || null,
				default: variety.is_default,
				types: data.missingno ? variety.types : [],
				abilities: data.missingno ? variety.abilities : []
			};
		});
		this.chain = {
			url: data.evolution_chain ? data.evolution_chain.url : null,
			data: data.missingno ? missingno.chain : data.evolution_chain ? [] : [data.id]
		};
		this.stats = data.missingno ? data.stats : null;
		this.height = data.missingno ? data.height : null;
		this.weight = data.missingno ? data.weight : null;
		this.moveSet = data.missingno ? data.moveSet : [];
		this.moveSetVersion = data.missingno ? data.moveSetVersion : null;
		this.gameDataCached = data.missingno || false;
		this.missingno = data.missingno || false;
		this.cry = data.id > store.pokemonCountWithCry
			? null
			: path.join(__dirname, '..', '..', 'assets', 'sounds', 'pokedex', `${data.id}.wav`);
	}

	get baseStatTotal() {
		if (!this.stats) return null;
		return this.stats.hp + this.stats.atk + this.stats.def + this.stats.sAtk + this.stats.sDef + this.stats.spd;
	}

	get class() {
		if (this.legendary) return 'legendary';
		if (this.mythical) return 'mythical';
		if (this.baby) return 'baby';
		if (this.missingno) return 'glitch';
		return 'standard';
	}

	get displayID() {
		if (this.missingno) return '???';
		return this.id.toString().padStart(3, '0');
	}

	get slug() {
		return this.store.makeSlug(this.name);
	}

	get spriteImageURL() {
		if (this.missingno) return missingno.sprite;
		if (this.id === 898) return 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/898.png';
		return `https://serebii.net/pokemon/art/${this.displayID}.png`;
	}

	get boxImageURL() {
		if (this.missingno) return missingno.box;
		return `https://www.serebii.net/pokedex-swsh/icon/${this.displayID}.png`;
	}

	get serebiiURL() {
		if (this.missingno) return missingno.url;
		return `https://www.serebii.net/pokedex-swsh/${this.displayID}.shtml`;
	}

	async fetchGameData() {
		if (this.gameDataCached) return this;
		const defaultVariety = this.varieties.find(variety => variety.default);
		const { body: defaultBody } = await request.get(`https://pokeapi.co/api/v2/pokemon/${defaultVariety.id}`);
		defaultVariety.types.push(...defaultBody.types.map(type => firstUpperCase(type.type.name)));
		for (const ability of defaultBody.abilities) {
			const { body: defaultAbilityBody } = await request.get(ability.ability.url);
			defaultVariety.abilities.push(defaultAbilityBody.names.find(name => name.language.name === 'en').name);
		}
		this.stats = {
			hp: defaultBody.stats.find(stat => stat.stat.name === 'hp').base_stat,
			atk: defaultBody.stats.find(stat => stat.stat.name === 'attack').base_stat,
			def: defaultBody.stats.find(stat => stat.stat.name === 'defense').base_stat,
			sAtk: defaultBody.stats.find(stat => stat.stat.name === 'special-attack').base_stat,
			sDef: defaultBody.stats.find(stat => stat.stat.name === 'special-defense').base_stat,
			spd: defaultBody.stats.find(stat => stat.stat.name === 'speed').base_stat
		};
		const inSwordShield = defaultBody.moves
			.some(move => move.version_group_details.some(mve => mve.version_group.name === 'sword-shield'));
		this.moveSetVersion = inSwordShield ? 'sword-shield' : 'ultra-sun-ultra-moon';
		for (const move of defaultBody.moves) {
			const versionGroup = move.version_group_details.find(mve => mve.version_group.name === this.moveSetVersion);
			if (!versionGroup || !versionGroup.level_learned_at) continue;
			const { body: moveBody } = await request.get(move.move.url);
			this.moveSet.push({
				name: moveBody.names.find(name => name.language.name === 'en').name,
				level: versionGroup.level_learned_at
			});
		}
		this.moveSet = this.moveSet.sort((a, b) => a.level - b.level);
		for (const variety of this.varieties) {
			if (variety.id === defaultVariety.id) continue;
			const { body } = await request.get(`https://pokeapi.co/api/v2/pokemon/${variety.id}`);
			variety.types.push(...body.types.map(type => firstUpperCase(type.type.name)));
			for (const ability of body.abilities) {
				const { body: abilityBody } = await request.get(ability.ability.url);
				variety.abilities.push(abilityBody.names.find(name => name.language.name === 'en').name);
			}
		}
		this.height = defaultBody.height * 3.94;
		this.weight = defaultBody.weight * 0.2205;
		this.heldItems = defaultBody.held_items
			.filter(item => item.version_details.some(version => {
				const inSwordShield = version.version.name === 'sword' || version.version.name === 'shield';
				if (inSwordShield) return true;
				if (!inSwordShield && (version.version.name === 'ultra-sun' || version.version.name === 'ultra-moon')) {
					return true;
				}
				return false;
			}))
			.map(item => {
				const inSwordShield = item.version_details
					.some(version => version.version.name === 'sword' || version.version.name === 'shield');
				const rarity = item.version_details
					.find(version => {
						if (inSwordShield) return true;
						const sunMoon = version.version.name === 'ultra-sun' || version.version.name === 'ultra-moon';
						if (!inSwordShield && sunMoon) return true;
						return false;
					}).rarity;
				return {
					url: item.item.url,
					name: null,
					rarity
				};
			});
		await this.fetchHeldItemNames();
		await this.fetchChain();
		this.gameDataCached = true;
		return this;
	}

	async fetchChain() {
		if (this.chain.data.length) return this.chain.data;
		const { body } = await request.get(this.chain.url);
		const basePkmn = await this.store.fetch(body.chain.species.name);
		this.chain.data.push(basePkmn.id);
		if (body.chain.evolves_to.length) {
			const evolution1 = body.chain.evolves_to;
			if (!evolution1) return this.chain.data;
			const evos1 = [];
			const evos2 = [];
			for (const evolution of evolution1) {
				const pkmn = await this.store.fetch(evolution.species.name);
				evos1.push(pkmn.id);
				if (evolution.evolves_to) {
					for (const evolution2 of evolution.evolves_to) {
						const pkmn2 = await this.store.fetch(evolution2.species.name);
						evos2.push(pkmn2.id);
					}
				}
			}
			this.chain.data.push(evos1.length === 1 ? evos1[0] : evos1);
			if (evos2.length) this.chain.data.push(evos2.length === 1 ? evos2[0] : evos2);
		}
		return this.chain.data;
	}

	async fetchHeldItemNames() {
		for (const item of this.heldItems) {
			const { body } = await request.get(item.url);
			item.name = body.names.find(name => name.language.name === 'en').name;
		}
		return this.heldItems;
	}
};
