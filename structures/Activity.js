const { ActivityType } = require('discord.js');
const { formatNumber } = require('../util/Util');

module.exports = [
	{
		text: 'Rune Factory 4',
		emoji: '🎮',
		type: ActivityType.Playing
	},
	{
		text: 'Rune Factory 4 Special',
		emoji: '🎮',
		type: ActivityType.Playing
	},
	{
		text: 'Playing with your heart',
		emoji: '❤️',
		type: ActivityType.Custom
	},
	{
		text: 'Watching you eat pant',
		emoji: '👖',
		type: ActivityType.Custom
	},
	{
		text: 'Watching anime',
		emoji: '📺',
		type: ActivityType.Custom
	},
	{
		text: 'Watching over the inn',
		emoji: '🏡',
		type: ActivityType.Custom
	},
	{
		text: 'Playing at the inn',
		emoji: '🏡',
		type: ActivityType.Custom
	},
	{
		text: 'Playing in Selphia',
		emoji: '🗺️',
		type: ActivityType.Custom
	},
	{
		text: 'Playing with Amber',
		emoji: '🍁',
		type: ActivityType.Custom
	},
	{
		text: 'Playing with a cardboard box',
		emoji: '📦',
		type: ActivityType.Custom
	},
	{
		text: 'Playing in the fridge',
		emoji: '🥚',
		type: ActivityType.Custom
	},
	{
		text: 'Playing with a knife',
		emoji: '🔪',
		type: ActivityType.Custom
	},
	{
		text: 'Playing with a murderous cow',
		emoji: '🐄',
		type: ActivityType.Custom
	},
	{
		text: client => `${formatNumber(client.guilds.cache.size)} servers`,
		emoji: '👀',
		type: ActivityType.Custom
	},
	{
		text: client => `${formatNumber(client.registry.commands.size)} commands`,
		emoji: '🤖',
		type: ActivityType.Custom
	},
	{
		text: client => `${formatNumber(client.registry.totalUses)} command uses`,
		emoji: '🤖',
		type: ActivityType.Custom
	},
	{
		text: client => client.avatarChanger.holiday ? client.avatarChanger.holiday.activity : 'Just a normal day...',
		type: ActivityType.Custom
	}
];
