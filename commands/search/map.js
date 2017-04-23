const { Command } = require('discord.js-commando');
const request = require('superagent');

module.exports = class MapCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'map',
            aliases: [
                'location'
            ],
            group: 'search',
            memberName: 'map',
            description: 'Gets a map image for the location you define with the zoom level you define (1-20).',
            args: [{
                key: 'zoom',
                prompt: 'What would you like the zoom level for the map to be? Limit 1-20.',
                type: 'integer',
                validate: zoom => {
                    if (zoom < 21 && zoom > 0) {
                        return true;
                    }
                    return 'Please enter a zoom value from 1-20';
                }
            }, {
                key: 'location',
                prompt: 'What location you like to get a map image for?',
                type: 'string',
                parse: text => encodeURIComponent(text)
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('ATTACH_FILES')) return message.say(':x: Error! I don\'t have the Attach Files Permission!');
        }
        const { zoom, location } = args;
        try {
            const { body } = await request
                .get(`https://maps.googleapis.com/maps/api/staticmap?center=${location}&zoom=${zoom}&size=500x500&key=${process.env.GOOGLE_KEY}`);
            return message.channel.send({files: [{attachment: body}]});
        } catch (err) {
            return message.say(':x: Error! Something went wrong! Make sure you entered the location correctly!');
        }
    }
};
