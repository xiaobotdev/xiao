const commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('request-promise');

class WikipediaCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'wikipedia', 
            group: 'search',
            memberName: 'wikipedia',
            description: 'Searches Wikipedia for something. (;wikipedia Cat **Note: CAsE SenSiTiVe!**)',
            examples: [';wikipedia Cat']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return;
        }
        console.log("[Command] " + message.content);
        let wikied = message.content.split(" ").slice(1).join("%20");
        const options = {
	        method: 'GET',
	        uri: "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&titles=" + wikied + "&exintro=&explaintext=&redirects=&formatversion=2",
  	        json: true
        }
        request(options).then(function (response) {
            let description = response.query.pages[0].extract;
            let name = response.query.pages[0].title;
            wikied = wikied.replace(")", "%29");
            if(description === undefined) {
                message.channel.sendMessage(":x: Error! Entry Not Found!");
            } else {
                description = description.substr(0, 1900);
                description = description.split('\n').join("\n\n");
                if(description.length > 1900) {
                    const embed = new Discord.RichEmbed()
                    .setColor(0xE7E7E7)
                    .setTitle(name)
                    .setURL("https://en.wikipedia.org/wiki/" + wikied)
                    .setAuthor("Wikipedia", "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1122px-Wikipedia-logo-v2.svg.png")
                    .setDescription(description + '...' + "\n\n" + "[Read the Rest Here](https://en.wikipedia.org/wiki/" + wikied + ")");
                    message.channel.sendEmbed(embed).catch(console.error);
                } else {
                    const embed = new Discord.RichEmbed()
                    .setColor(0xE7E7E7)
                    .setTitle(name)
                    .setURL("https://en.wikipedia.org/wiki/" + wikied)
                    .setAuthor("Wikipedia", "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1122px-Wikipedia-logo-v2.svg.png")
                    .setDescription(description + "\n\n" + "[Read the Rest Here](https://en.wikipedia.org/wiki/" + wikied + ")");
                    message.channel.sendEmbed(embed).catch(console.error);
                }
            }
        }).catch(function (err) {
            message.channel.sendMessage(":x: Error! Entry Not Found!");
        });
    }
}

module.exports = WikipediaCommand;