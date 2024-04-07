const { ActivityType } = require('discord.js');
const { formatNumber } = require('./util/Util');

module.exports = [
	{
		text: 'Rune Factory 4',
		type: ActivityType.Playing
	},
	{
		text: 'Rune Factory 4 Special',
		type: ActivityType.Playing
	},
	{
		text: 'with your heart',
		type: ActivityType.Playing
	},
	{
		text: 'you eat pant',
		type: ActivityType.Watching
	},
	{
		text: 'anime',
		type: ActivityType.Watching
	},
	{
		text: 'over the inn',
		type: ActivityType.Watching
	},
	{
		text: 'at the inn',
		type: ActivityType.Playing
	},
	{
		text: 'in Selphia',
		type: ActivityType.Playing
	},
	{
		text: 'with Amber',
		type: ActivityType.Playing
	},
	{
		text: 'with a cardboard box',
		type: ActivityType.Playing
	},
	{
		text: 'in the fridge',
		type: ActivityType.Playing
	},
	{
		text: 'with a knife',
		type: ActivityType.Playing
	},
	{
		text: 'with a murderous cow',
		type: ActivityType.Playing
	},
	{
		text: 'with a linter',
		type: ActivityType.Playing
	},
	{
		text: (client) => `${formatNumber(client.guilds.cache.size)} servers`,
		type: ActivityType.Watching
	},
	{
		text: (client) => `with ${formatNumber(client.registry.commands.size)} commands`,
		type: ActivityType.Playing
	},
	{
		text: (client) => `${formatNumber(client.channels.cache.size)} channels`,
		type: ActivityType.Watching
	}
];
