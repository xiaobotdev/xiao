const { Command } = require('discord.js-commando');
const request = require('superagent');

module.exports = class MapCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'map',
            group: 'search',
            memberName: 'map',
            description: 'Gets a map image for the location you define with the zoom level you define (1-20).',
            args: [
                {
                    key: 'zoom',
                    label: 'zoom level',
                    prompt: 'What would you like the zoom level for the map to be? Limit 1-20.',
                    type: 'integer',
                    validate: zoom => {
                        if (zoom < 21 && zoom > 0)
                            return true;
                        return 'Please enter a zoom value from 1-20';
                    }
                },
                {
                    key: 'query',
                    prompt: 'What location you like to get a map image for?',
                    type: 'string',
                    parse: query => encodeURIComponent(query)
                }
            ]
        });
    }

    async run(msg, args) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('ATTACH_FILES'))
                return msg.say('This Command requires the `Attach Files` Permission.');
        const { zoom, query } = args;
        try {
            const { body } = await request
                .get(`https://maps.googleapis.com/maps/api/staticmap?center=${query}&zoom=${zoom}&size=500x500&key=${process.env.GOOGLE_KEY}`);
            return msg.channel.send({files: [{attachment: body}]})
                .catch(err => msg.say(`An Error Occurred: ${err}`));
        } catch (err) {
            return msg.say('An Error Occurred. The location may not have been found.');
        }
    }
};
