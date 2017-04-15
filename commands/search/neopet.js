const { Command } = require('discord.js-commando');
const request = require('superagent');
const cheerio = require('cheerio');

module.exports = class NeopetCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'neopet',
            group: 'search',
            memberName: 'neopet',
            description: 'Gives a Neopet\'s image, searchable by name. (;neopet Pikachu53535)',
            examples: [';neopet Pikachu53535'],
            args: [{
                key: 'pet',
                prompt: 'What pet would you like to get the image of?',
                type: 'string'
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('ATTACH_FILES')) return message.say(':x: Error! I don\'t have the Attach Files Permission!');
        }
        const pet = args.pet;
        try {
            const response = await request
                .get('http://www.sunnyneo.com/petimagefinder.php')
                .query({
                    name: pet,
                    size: 5,
                    mood: 1
                });
            const $ = cheerio.load(response.text);
            const link = $('textarea').first().text();
            if (!link.includes('cp')) return message.say(':x: Error! Pet not found!');
            return message.say(link);
        }
        catch (err) {
            return message.say(':x: Error! Something went wrong!');
        }
    }
};
