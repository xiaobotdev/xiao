const { Command } = require('discord.js-commando');
const request = require('superagent');

module.exports = class MapCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'map',
            group: 'search',
            memberName: 'map',
            description: 'Gets a map image for the location you define with the zoom level you define (1-20).',
            args: [{
                key: 'zoom',
                prompt: 'What would you like the zoom level for the map to be? Limit 1-20.',
                type: 'integer',
                validate: zoom => {
                    if (zoom < 21 && zoom > 0)
                        return true;
                    return 'Please enter a zoom value from 1-20';
                }
            }, {
                key: 'query',
                prompt: 'What location you like to get a map image for?',
                type: 'string',
                parse: query => encodeURIComponent(query)
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm')
            if (!message.channel.permissionsFor(this.client.user).has('ATTACH_FILES'))
                return message.say('This Command requires the `Attach Files` Permission.');
        const { zoom, query } = args;
        try {
            const { body } = await request
                .get(`https://maps.googleapis.com/maps/api/staticmap?center=${query}&zoom=${zoom}&size=500x500&key=${process.env.GOOGLE_KEY}`);
            return message.channel.send({files: [{attachment: body}]});
        } catch (err) {
            return message.say('An Error Occurred. The location may not have been found.');
        }
    }
};
