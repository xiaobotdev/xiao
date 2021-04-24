const { ArgumentType } = require('discord.js-commando');
const cityTimezones = require('city-timezones');
const moment = require('moment-timezone');

module.exports = class TimezoneType extends ArgumentType {
	constructor(client) {
		super(client, 'timezone');
	}

	validate(value) {
		value = value.replaceAll(' ', '_').toLowerCase();
		const directZone = moment.tz.zone(value);
		if (directZone) return true;
		const cityZone = cityTimezones.lookupViaCity(value);
		if (cityZone.length) return true;
		const provZone = cityTimezones.findFromCityStateProvince(value);
		if (provZone.length) return true;
		return false;
	}

	parse(value) {
		value = value.replaceAll(' ', '_').toLowerCase();
		const directZone = moment.tz.zone(value);
		if (directZone) return directZone.name;
		const cityZone = cityTimezones.lookupViaCity(value);
		if (cityZone.length) return cityZone[0].timezone;
		const provZone = cityTimezones.findFromCityStateProvince(value);
		if (provZone.length) return provZone[0].timezone;
		return null;
	}
};
