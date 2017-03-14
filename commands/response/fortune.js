const commando = require('discord.js-commando');

class FortuneCookieCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'fortune', 
            group: 'response',
            memberName: 'fortune',
            description: 'Fortune Cookie. (;fortune)',
            examples: [';fortune']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let fortunes = ["Do not seek so much to find the answer as much as to understand the question better.", "You will soon be honored by someone you respect.", "Happiness comes from a good life.", "You are contemplating some action which will bring credit upon you.", "Be prepared for extra energy.", "You are admired for your adventurous ways.", "The love of your life is sitting across from you.", "Beauty is simply beauty. Originality is magical.", "Never quit!", "Today is an ideal time to water your personal garden.", "Questions provide the key to unlocking our unlimited potential.", "Expect great things and great things will come.", "The Greatest War Sometimes Isn't On The Battlefield But Against Oneself.", "Become who you are.", "In case of fire, keep calm, pay bill and run.", "Anyone who dares to be, can never be weak.", "You broke my cookie!", "Dream lofty dreams, and as you dream, so shall you become.", "You've got what it takes, but it will take everything you've got!", "Trust your intuition.", "The wise are aware of their treasure, while fools follow their vanity.", "You will always have good luck in your personal affairs.", "You don't need talent to gain experience.", "All the preparation you've done will finally be paying off!", "Determination is the wake-up call to the human will.", "The most useless energy is trying to change what and who God so carefully created.", "You cannot become rich except by enriching others.", "Your happiness is intertwined with your outlook on life.", "Sing and rejoice, fortune is smiling on you.", "Well-arranged time is the surest sign of a well-arranged mind."];
        fortunes = fortunes[Math.floor(Math.random() * fortunes.length)];
        message.channel.sendMessage(fortunes);
    }
}

module.exports = FortuneCookieCommand;