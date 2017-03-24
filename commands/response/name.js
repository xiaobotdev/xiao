const commando = require('discord.js-commando');

module.exports = class RandomNameGen extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'name',
            aliases: [
                'namegen',
                'randomname'
            ],
            group: 'response',
            memberName: 'name',
            description: 'Generates a random name (;name Male)',
            examples: [';name', ';name male', ';name female']
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let randomFirstMale = ["Bob", "Daniel", "Logan", "Chris", "Nathan", "George", "Mart", "Charlie", "Felix", "Ralph", "William", "Max", "Jerry", "Marty", "Joshua", "Cody", "Richard", "Alex", "Alexander", "Jordan", "Zachary", "Bill", "Alfred", "Bruce", "Caiden", "Calvin", "Eric", "Robert", "Mark", "Miles", "Nash", "Ronald", "Ivan", "Edgar", "Royal", "Augustine", "Dominic", "Noel", "Rocky", "Grover", "Paul", "Jeremy", "Stevie", "Brock", "Jc", "Tony", "Enoch", "Zachery", "Harvey", "Gilbert", "Chang", "Emery", "Carroll", "Odell", "Jean", "Archie", "Russ", "Barry", "Lowell", "Jacob", "Riku", "Frederic", "Levi", "Faustino", "Leland", "Domenic", "Irwin", "Moises", "Louie", "Larry", "Victor"];
        randomFirstMale = randomFirstMale[Math.floor(Math.random() * randomFirstMale.length)];
        let randomFirstFemale = ["Elizabeth", "Chelsey", "Rachel", "Logan", "Alex", "Jordan", "Mary", "Shirley", "Sandy", "Linda", "Audrey", "Autumn", "Gracie", "Grace", "Erin", "Catherine", "Stephanie", "Lucy", "Patty", "Julie", "Christina", "Fiona", "Riley", "Ashley", "Bree", "Lucila", "Wendi", "Evangelina", "Ricki", "Merna", "Tegan", "Venus", "Claris", "Tana", "Sakura", "Edythe", "Adena", "Princess", "Elnora", "Star", "Edyth", "Beverly", "Kelsie", "Letha", "Latisha", "Lolita", "Bernandine", "Jessenia", "Hannah", "Leonore", "Alene", "Fannie", "Bernardine", "Leena", "Tera", "Yvette", "Melisa", "Alissa", "Xiao", "Richelle", "Bridgett", "Sumiko", "Paulette", "Charlott", "Honey", "Veola", "Sherita", "Amanda", "Vannessa", "April", "Ruth"];
        randomFirstFemale = randomFirstFemale[Math.floor(Math.random() * randomFirstFemale.length)];
        let randomLast = ["Walker", "Tworni", "Ross", "Smith", "Odendahl", "Deere", "Brown", "Williams", "Jones", "Miles", "Moss", "Roberto", "McFly", "McDonald", "Lewis", "Armstrong", "Stevenson", "Schwarzenegger", "Robinson", "Parker", "Piper", "Johnson", "Brantley", "Stewart", "Ree", "Talbot", "Seville", "Peace", "Spielberg", "Baggins", "Wilborn", "Vankirk", "Shireman", "Jimerson", "Masters", "Hack", "Satcher", "Younkin", "Aguila", "Duffey", "Burgin", "Highfall", "Wee", "Solari", "Tomaselli", "Basler", "Difranco", "Latch", "Rives", "Dolan", "Abraham", "Holter", "Portugal", "Lininger", "Holst", "Mccroy", "Follmer", "Hotchkiss", "Gassaway", "Wang", "Agron", "Raasch", "Gourd", "Czaja", "Marquart", "Papadopoulos", "Ringer", "Lax", "Sperling", "Galusha", "Alston"];
        randomLast = randomLast[Math.floor(Math.random() * randomLast.length)];
        let randomFirstBoth = [randomFirstMale, randomFirstFemale];
        randomFirstBoth = randomFirstBoth[Math.floor(Math.random() * randomFirstBoth.length)];
        if (message.content.toLowerCase().split(" ").slice(1).includes("male")) {
            return message.channel.send(`${randomFirstMale} ${randomLast}`);
        }
        else if (message.content.toLowerCase().split(" ").slice(1).includes("female")) {
            return message.channel.send(`${randomFirstFemale} ${randomLast}`);
        }
        else {
            return message.channel.send(`${randomFirstBoth} ${randomLast}`);
        }
    }
};
