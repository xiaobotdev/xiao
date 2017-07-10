const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class WikiaCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'wikia',
            group: 'search',
            memberName: 'wikia',
            description: 'Searches a specified Wikia wiki for your query.',
            clientPermissions: ['EMBED_LINKS'],
            args: [
                {
                    key: 'wiki',
                    prompt: 'What is the subdomain of the wikia you want to search?',
                    type: 'string'
                },
                {
                    key: 'query',
                    prompt: 'What would you like to search for?',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg, args) {
        const { wiki, query } = args;
        try {
            const search = await snekfetch
                .get(`http://${wiki}.wikia.com/api/v1/Search/List/`)
                .query({
                    query,
                    limit: 1,
                    namespaces: 0
                });
            const id = search.body.items[0].id;
            const { body } = await snekfetch
                .get(`http://${wiki}.wikia.com/api/v1/Articles/AsSimpleJson/`)
                .query({ id });
            const embed = new MessageEmbed()
                .setColor(0x002D54)
                .setTitle(body.sections[0].title)
                .setAuthor('Wikia', 'https://i.imgur.com/WzXWJka.png')
                .setDescription(body.content[0].text)
                .setThumbnail(body.sections[0].images[0]);
            return msg.embed(embed);
        } catch (err) {
            console.log(err);
            return msg.say('No Results or Invalid Wiki.');
        }
    }
};
