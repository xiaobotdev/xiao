const commando = require('discord.js-commando');
const request = require('superagent');
const config = require('../../config.json');

module.exports = class YodaCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'yoda',
            group: 'textedit',
            memberName: 'yoda',
            description: 'Converts text to Yoda Speak. (;yoda This is Yoda.)',
            examples: [';yoda This is Yoda.']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let turnToYoda = message.content.split(" ").slice(1).join(" ");
        if (!turnToYoda) {
            return message.channel.send(':x: Error! Nothing to translate!');
        }
        else {
            return request
                .get('https://yoda.p.mashape.com/yoda')
                .set({
                    'X-Mashape-Key': config.mashapekey,
                    'Accept': 'text/plain'
                })
                .query({
                    sentence: turnToYoda
                })
                .then(function(response) {
                    if (response === undefined) {
                        return message.channel.send(':x: Error! Something went wrong! Keep it simple to avoid this error.');
                    }
                    else {
                        return message.channel.send(response.text).catch(error => message.channel.send(':x: Error! Something went wrong! Keep it simple to avoid this error.'));
                    }
                }).catch(function(err) {
                    console.log(err);
                    return message.channel.send(":x: Error! Unknown Error. Try again later!");
                });
        }
    }
};
