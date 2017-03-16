const commando = require('discord.js-commando');
const google = require('google');

class GoogleCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'google', 
            group: 'search',
            memberName: 'google',
            description: 'Searches Google for something. (;google Discord)',
            examples: [';google Discord']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let searchQuery = message.content.split(" ").slice(1).join(" ");
        if(searchQuery === "") {
            message.channel.send(':x: Error! I cannot search google for nothing!');
        } else {
            google.resultsPerPage = 2
            google(searchQuery, function (err, res) {
                if (res === undefined) {
                    message.channel.send(':x: Error! Too many requests! Try again later! (Much later)');
                } else {
                    let link = res.links;
                    if(link === undefined) {
                        message.channel.send(':x: Error! No Results Found!');
                    } else {
                        if(link[0] === undefined) {
                            message.channel.send(':x: Error! No Results Found!');
                        } else {
                            if(link[0].href === null) {
                                message.channel.send(':x: Error! No Results Found!');
                            } else {
                                message.channel.send(link[0].href).catch(error => message.channel.send(':x: An Error Occurred! Try again later!'));
                            }
                        }
                    }
                }
            });
        }
    }
}

module.exports = GoogleCommand;