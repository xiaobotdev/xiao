const request = require('node-superfetch');
const path = require('path');
const { removeDuplicates, firstUpperCase } = require('../../util/Util');
const missingno = require('../../assets/json/missingno');
const versions = require('../../assets/json/pokedex-location');

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
		this.heldItems = data.missingno ? data.held_items : [];
		this.varieties = data.varieties.map(variety => {
			const name = firstUpperCase(variety.pokemon.name
				.replace(new RegExp(`${this.slug}-?`, 'i'), '')
				.replaceAll('-', ' '));
			return {
				id: variety.pokemon.name,
				name: name || null,
				mega: data.missingno ? false : null,
				stats: data.missingno ? variety.stats : {},
				statsDiffer: data.missingno ? true : null,
				default: variety.is_default,
				types: data.missingno ? variety.types : [],
				abilities: data.missingno ? variety.abilities : [],
				gameDataCached: data.missingno || false
			};
		});
		this.chain = {
			url: data.evolution_chain ? data.evolution_chain.url : null,
			data: data.missingno ? missingno.chain : data.evolution_chain ? [] : [data.id]
		};
		this.encountersURL = null;
		this.encounters = data.missingno ? data.encounters : null;
		this.height = data.missingno ? data.height : null;
		this.weight = data.missingno ? data.weight : null;
		this.rawMoveSet = null;
		this.moveSet = data.missingno ? data.moveSet : [];
		this.moveSetVersion = data.missingno ? data.moveSetVersion : null;
		this.gameDataCached = data.missingno || false;
		this.missingno = data.missingno || false;
		this.cry = data.id > store.pokemonCountWithCry
			? null
			: path.join(__dirname, '..', '..', 'assets', 'sounds', 'pokedex', `${data.id}.wav`);
		this.smogonTiers = data.missingno ? data.smogonTiers : {};
	}

	baseStatTotal(variety) {
		const found = this.varieties.find(vrity => variety ? vrity.id === variety.toLowerCase() : vrity.default);
		if (!found) return null;
		return found.stats.hp + found.stats.atk + found.stats.def + found.stats.sAtk + found.stats.sDef + found.stats.spd;
	}

	get pseudo() {
		if (!this.gameDataCached) return null;
		if (this.legendary || this.mythical || this.baby || this.missingno) return false;
		if (this.baseStatTotal() !== 600) return false;
		if (this.chain.data.length !== 3) return false;
		return true;
	}

	get generation() {
		if (this.id > 898) return null;
		if (this.id >= 810) return 8;
		if (this.id >= 722) return 7;
		if (this.id >= 650) return 6;
		if (this.id >= 494) return 5;
		if (this.id >= 387) return 4;
		if (this.id >= 252) return 3;
		if (this.id >= 152) return 2;
		if (this.id >= 0) return 1;
		return null;
	}

	get class() {
		if (this.legendary) return 'legendary';
		if (this.mythical) return 'mythical';
		if (this.baby) return 'baby';
		if (this.missingno) return 'glitch';
		if (this.pseudo) return 'pseudo';
		return 'standard';
	}

	get mega() {
		if (!this.gameDataCached) return null;
		return this.varieties.some(variety => variety.mega);
	}

	get displayID() {
		if (this.missingno) return '???';
		return this.id.toString().padStart(3, '0');
	}

	get slug() {
		return this.store.makeSlug(this.name);
	}

	get spriteImageURL() {
		if (this.missingno) return missingno.sprites.default;
		if (this.id === 898) return 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/898.png';
		return `https://serebii.net/pokemon/art/${this.displayID}.png`;
	}

	formSpriteImageURL(variety) {
		if (this.missingno) {
			if (variety.toLowerCase() === 'missingno-yellow') return missingno.sprites.yellow;
			return missingno.sprites.default;
		}
		if (this.id === 898) return 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/898.png';
		const found = this.varieties.find(vrity => variety ? vrity.id === variety.toLowerCase() : vrity.default);
		const name = found.default ? '' : found.mega
			? found.name.toLowerCase().split(' ').map(n => n.charAt(0)).join('')
			: found.name.toLowerCase().charAt(0);
		return `https://serebii.net/pokemon/art/${this.displayID}${name ? `-${name}` : ''}.png`;
	}

	get boxImageURL() {
		if (this.missingno) return missingno.box;
		return `https://www.serebii.net/pokedex-swsh/icon/${this.displayID}.png`;
	}

	formBoxImageURL(variety) {
		if (this.missingno) return missingno.box;
		const found = this.varieties.find(vrity => variety ? vrity.id === variety.toLowerCase() : vrity.default);
		const name = found.default ? '' : found.mega
			? found.name.toLowerCase().split(' ').map(n => n.charAt(0)).join('')
			: found.name.toLowerCase().charAt(0);
		return `https://www.serebii.net/pokedex-swsh/icon/${this.displayID}${name ? `-${name}` : ''}.png`;
	}

	get serebiiURL() {
		if (this.missingno) return missingno.url;
		return `https://www.serebii.net/pokedex-swsh/${this.displayID}.shtml`;
	}

	smogonURL(gen) {
		if (this.missingno) return missingno.url;
		return `https://www.smogon.com/dex/${gen.toLowerCase()}/pokemon/${this.slug}/`;
	}

	async fetchSmogonTiers(...gens) {
		for (const gen of gens) {
			if (!this.store.smogonData[gen.toLowerCase()]) await this.store.fetchSmogonData(gen.toLowerCase());
			const pkmn = this.store.smogonData[gen.toLowerCase()].find(data => data.id === this.id);
			this.smogonTiers[gen.toLowerCase()] = pkmn.formats;
		}
		return this.smogonTiers;
	}

	async fetchGameData() {
		if (this.gameDataCached) return this;
		await this.fetchDefaultVariety();
		await this.fetchMoves(this.rawMoveSet);
		await this.fetchHeldItemNames();
		await this.fetchOtherVarieties();
		await this.fetchChain();
		this.gameDataCached = true;
		return this;
	}

	async fetchDefaultVariety() {
		const defaultVariety = this.varieties.find(variety => variety.default);
		if (defaultVariety.gameDataCached) return this;
		const { body: defaultBody } = await request.get(`https://pokeapi.co/api/v2/pokemon/${defaultVariety.id}`);
		defaultVariety.types.push(...defaultBody.types.map(type => firstUpperCase(type.type.name)));
		for (const ability of defaultBody.abilities) {
			const defaultAbilityData = await this.store.abilities.fetch(ability.ability.name);
			defaultVariety.abilities.push(defaultAbilityData);
		}
		defaultVariety.stats = {
			hp: defaultBody.stats.find(stat => stat.stat.name === 'hp').base_stat,
			atk: defaultBody.stats.find(stat => stat.stat.name === 'attack').base_stat,
			def: defaultBody.stats.find(stat => stat.stat.name === 'defense').base_stat,
			sAtk: defaultBody.stats.find(stat => stat.stat.name === 'special-attack').base_stat,
			sDef: defaultBody.stats.find(stat => stat.stat.name === 'special-defense').base_stat,
			spd: defaultBody.stats.find(stat => stat.stat.name === 'speed').base_stat
		};
		defaultVariety.statsDiffer = true;
		defaultVariety.gameDataCached = true;
		const inSwordShield = defaultBody.moves
			.some(move => move.version_group_details.some(mve => mve.version_group.name === 'sword-shield'));
		this.moveSetVersion = inSwordShield ? 'sword-shield' : 'ultra-sun-ultra-moon';
		this.height = defaultBody.height * 3.94;
		this.weight = defaultBody.weight * 0.2205;
		this.encountersURL = defaultBody.location_area_encounters;
		this.rawMoveSet = defaultBody.moves;
		await this.fetchHeldItems(defaultBody.held_items);
		return this;
	}

	async fetchOtherVarieties() {
		const defaultVariety = this.varieties.find(variety => variety.default);
		for (const variety of this.varieties) {
			if (variety.id === defaultVariety.id) continue;
			if (variety.gameDataCached) continue;
			const { body } = await request.get(`https://pokeapi.co/api/v2/pokemon/${variety.id}`);
			const { body: formBody } = await request.get(`https://pokeapi.co/api/v2/pokemon-form/${variety.id}`);
			variety.types.push(...body.types.map(type => firstUpperCase(type.type.name)));
			variety.mega = formBody.is_mega || false;
			variety.stats = {
				hp: body.stats.find(stat => stat.stat.name === 'hp').base_stat,
				atk: body.stats.find(stat => stat.stat.name === 'attack').base_stat,
				def: body.stats.find(stat => stat.stat.name === 'defense').base_stat,
				sAtk: body.stats.find(stat => stat.stat.name === 'special-attack').base_stat,
				sDef: body.stats.find(stat => stat.stat.name === 'special-defense').base_stat,
				spd: body.stats.find(stat => stat.stat.name === 'speed').base_stat
			};
			const baseStats = defaultVariety.stats;
			variety.statsDiffer = baseStats.hp !== variety.stats.hp
				|| baseStats.atk !== variety.stats.atk
				|| baseStats.def !== variety.stats.def
				|| baseStats.sAtk !== variety.stats.sAtk
				|| baseStats.sDef !== variety.stats.sDef
				|| baseStats.spd !== variety.stats.spd;
			for (const ability of body.abilities) {
				const abilityData = await this.store.abilities.fetch(ability.ability.name);
				variety.abilities.push(abilityData);
			}
			variety.gameDataCached = true;
		}
		return this.varieties;
	}

	async fetchMoves(moves) {
		for (const move of moves) {
			const versionGroup = move.version_group_details.find(mve => mve.version_group.name === this.moveSetVersion);
			if (!versionGroup || !versionGroup.level_learned_at) continue;
			const moveData = await this.store.moves.fetch(move.move.name);
			if (this.moveSet.some(mve => mve.move.id === moveData.id)) continue;
			this.moveSet.push({
				move: moveData,
				level: versionGroup.level_learned_at
			});
		}
		this.moveSet = this.moveSet.sort((a, b) => a.level - b.level);
		return this.moveSet;
	}

	async fetchHeldItems(heldItems) {
		this.heldItems = heldItems
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
				const { rarity } = item.version_details
					.find(version => {
						if (inSwordShield) return true;
						const sunMoon = version.version.name === 'ultra-sun' || version.version.name === 'ultra-moon';
						if (!inSwordShield && sunMoon) return true;
						return false;
					});
				return {
					data: null,
					slug: item.item.name,
					rarity
				};
			});
		return this.heldItems;
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
			const data = await this.store.items.fetch(item.slug);
			item.data = data;
		}
		return this.heldItems;
	}

	async fetchEncounters() {
		if (!this.encountersURL) return null;
		if (this.encounters) return this.encounters;
		const { body } = await request.get(this.encountersURL);
		if (!body.length) {
			this.encounters = body;
			return body;
		}
		this.encounters = [];
		for (const encounter of body) {
			if (!encounter.version_details.some(version => versions[version.version.name])) continue;
			const { body: encounterBody } = await request.get(encounter.location_area.url);
			const { body: locationBody } = await request.get(encounterBody.location.url);
			this.encounters.push({
				name: locationBody.names.find(name => name.language.name === 'en').name,
				versions: encounter.version_details
					.filter(version => versions[version.version.name])
					.map(version => version.version.name)
			});
		}
		return this.encounters;
	}
};
