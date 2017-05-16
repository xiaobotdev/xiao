const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { GOOGLE_KEY } = process.env;

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
                    type: 'string'
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
            const { body } = await snekfetch
                .get('https://maps.googleapis.com/maps/api/staticmap')
                .query({
                    center: query,
                    zoom,
                    size: '500x500',
                    key: GOOGLE_KEY
                });
            return msg.say({ files: [{ attachment: body, name: 'map.png' }] })
                .catch(err => msg.say(err));
        } catch (err) {
            return msg.say(err);
        }
    }
};
