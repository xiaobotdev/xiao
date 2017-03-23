const commando = require('discord.js-commando');
const request = require('superagent');
const config = require('../../config.json');

module.exports = class QuotesCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'quote',
            group: 'random',
            memberName: 'quote',
            description: 'Gets a random quote. (;quote)',
            examples: [';quote']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let randomTypes = ['movie', 'famous'];
        randomTypes = randomTypes[Math.floor(Math.random() * randomTypes.length)];
        return request
            .get('https://andruxnet-random-famous-quotes.p.mashape.com/')
            .set({
                'X-Mashape-Key': config.mashapekey,
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            })
            .query({
                cat: randomTypes
            })
            .then(function(response) {
                console.log(response);
                console.log(response.body);
                return message.channel.send(`"${response.body.quote}"\n - *${response.body.author}*`).catch(error => message.channel.send(':x: Error! Something went wrong!'));
            }).catch(function(err) {
                console.log(err);
                return message.channel.send(":x: Error! Unknown Error. Try again later!");
            });
    }
};
