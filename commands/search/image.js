const commando = require('discord.js-commando');
const request = require('superagent');
const cheerio = require('cheerio');

module.exports = class DefineCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'image',
            aliases: [
                'searchimage',
                'googleimages'
            ],
            group: 'search',
            memberName: 'image',
            description: 'Searches Google for an Image. (;image Cat)',
            examples: [';image Cat']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let thingToSearch = encodeURI(message.content.split(" ").slice(1).join(" "));
        await message.channel.send('Searching...').then(msg => {
            await request
                .get(`https://www.google.com/search?tbm=isch&gs_l=img&q=${encodeURI(thingToSearch)}`)
                .then(function(response) {
                    const $ = cheerio.load(response.text);
                    const result = $('.images_table').find('img').first().attr('src');
                    return msg.edit(result);
                }).catch(function(err) {
                    console.log(err);
                    return msg.edit(':x: Error! No Results Found!');
                });
        });
    }
};
