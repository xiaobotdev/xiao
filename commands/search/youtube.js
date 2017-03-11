const commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('request-promise');
const config = require('../../config.json');

class YouTubeCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'youtube', 
            group: 'search',
            memberName: 'youtube',
            description: 'Searches YouTube for a video. (;youtube video)',
            examples: [';youtube video']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let videotosearch = message.content.split(" ").slice(1).join("-");
        const options = {
	        method: 'GET',
	        uri: 'https://www.googleapis.com/youtube/v3/search',
	        qs: {
    	        part: 'snippet',
                type: 'video',
                maxResults: 1,
                q: videotosearch,
                order: 'viewCount',
                key: config.youtubekey
  	        },
  	        json: true
        } 
        request(options).then(function (response) {
            if(response.items[0].snippet === undefined) {
                message.channel.sendMessage(':x: Error! No Video Found!');
            } else {
                const embed = new Discord.RichEmbed()
                .setColor(0xDD2825)
                .setTitle(response.items[0].snippet.title)
                .setDescription(response.items[0].snippet.description)
                .setAuthor('YouTube - ' + response.items[0].snippet.channelTitle, 'https://cdn3.iconfinder.com/data/icons/social-icons-5/607/YouTube_Play.png')
                .setURL('https://www.youtube.com/watch?v=' + response.items[0].id.videoId)
                .setThumbnail(response.items[0].snippet.thumbnails.default.url);
                message.channel.sendEmbed(embed).catch(console.error);
            }
        }).catch(function (err) {
            message.channel.sendMessage(":x: Error! Daily Quota Reached! Try again tomorrow!");
        });
    }
}

module.exports = YouTubeCommand;