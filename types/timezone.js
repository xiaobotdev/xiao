const { ArgumentType } = require('discord.js-commando');
const cityTimezones = require('city-timezones');
const { ZipToTz } = require('zip-to-timezone');
const moment = require('moment-timezone');

module.exports = class TimezoneType extends ArgumentType {
	constructor(client) {
		super(client, 'timezone');
	}

	validate(value) {
		const directZone = moment.tz.zone(value.replaceAll(' ', '_').toLowerCase());
		if (directZone) return true;
		try {
			new ZipToTz().full(value);
			return true;
		} catch {
			const cityZone = cityTimezones.lookupViaCity(value);
			if (cityZone.length) return true;
			const provZone = cityTimezones.findFromCityStateProvince(value);
			if (provZone.length) return true;
		}
		return false;
	}

	parse(value) {
		const directZone = moment.tz.zone(value.replaceAll(' ', '_').toLowerCase());
		if (directZone) return directZone.name;
		try {
			const zipZone = new ZipToTz().full(value);
			return zipZone;
		} catch {
			const cityZone = cityTimezones.lookupViaCity(value);
			if (cityZone.length) return cityZone[0].timezone;
			const provZone = cityTimezones.findFromCityStateProvince(value);
			if (provZone.length) return provZone[0].timezone;
		}
		return null;
	}
};
