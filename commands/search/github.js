const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const moment = require('moment');
const { GITHUB_LOGIN } = process.env;

module.exports = class GithubCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'github',
            group: 'search',
            memberName: 'github',
            description: 'Gets repo information from GitHub.',
            clientPermissions: ['EMBED_LINKS'],
            args: [
                {
                    key: 'repo',
                    prompt: 'Which repo do you want to get information for?',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg, args) {
        const { repo } = args;
        try {
            const { body } = await snekfetch
                .get(`https://${GITHUB_LOGIN}@api.github.com/repos/${repo}`);
            const embed = new RichEmbed()
                .setColor(0xFFFFFF)
                .setAuthor('Github', 'https://i.imgur.com/ajcPgJG.png')
                .setURL(body.html_url)
                .setTitle(body.full_name)
                .setDescription(body.description)
                .setThumbnail(body.owner.avatar_url)
                .addField('❯ Creation Date',
                    moment(body.created_at).format('MMMM Do YYYY'), true)
                .addField('❯ Last Updated On',
                    moment(body.updated_at).format('MMMM Do YYYY'), true)
                .addField('❯ Stargazers',
                    body.stargazers_count, true)
                .addField('❯ Watchers',
                    body.watchers_count, true)
                .addField('❯ Open Issues',
                    body.open_issues_count, true)
                .addField('❯ Language',
                    body.language, true);
            return msg.embed(embed);
        } catch (err) {
            return msg.say(err.message);
        }
    }
};
