const commando = require('discord.js-commando');
const request = require('superagent');
const cheerio = require('cheerio');
const querystring = require('querystring');

module.exports = class DefineCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'google',
            aliases: [
                'search'
            ],
            group: 'search',
            memberName: 'google',
            description: 'Searches Google. (;google Cat)',
            examples: [';google Cat']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let thingToSearch = encodeURI(message.content.split(" ").slice(1).join(" "));
        message.channel.send('Searching...').then(msg => {
            const SEARCH_URL = `https://www.google.com/search?q=${thingToSearch}`;
            request
                .get(SEARCH_URL)
                .then(function(response) {
                    const $ = cheerio.load(response.text);
                    let href = $('.r').first().find('a').first().attr('href');
                    if (!href) return Promise.reject(new Error('NO RESULTS'));
                    href = querystring.parse(href.replace('/url?', ''));
                    msg.edit(href.q);
                }).catch(function(err) {
                    msg.edit(':x: Error! No Results Found!');
                });
        });
    }
};
