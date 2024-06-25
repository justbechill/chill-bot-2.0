//Require packages
require('dotenv').config();

const { Client, Events, GatewayIntentBits, Collection, REST, Routes, ActivityType } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const moment = require('moment')

let day = moment().day()

//List of possible activities that will be selected randomly
const activities = [
    { text: "Outer Wilds", type: ActivityType.Playing },
    { text: "Garden State", type: ActivityType.Watching },
    { text: "Weathering With You", type: ActivityType.Watching },
    { text: "A Silent Voice", type: ActivityType.Watching },
    { text: "Good Will Hunting", type: ActivityType.Watching },
    { text: "The Beginner's Guide", type: ActivityType.Playing },
    { text: "Omori", type: ActivityType.Playing },
    { text: "Elden Ring", type: ActivityType.Playing },
];


//Base options for server config, used when a new server is added
const baseServerConfig = {
    channels: {
        transcript: null,
        log: null,
        message: null,
        counting: null
    },
    commands: {},
    count: {},
    permissions: {}
}

//Message sent when bot joins a server
const serverJoinMessage = "**Thanks for inviting Chill Bot to your server!**\n\n__*A few things you might want to know:*__\n1. To enable features like counting and logs you need to use `/config channel`.  \n2. By default, only Admins are allowed to configure the bot settings. You can change this with `/config permissions`.\n3. Some commands are inside jokes or maybe even just annoying, so you can enable or disable any command with `/config command`.\n4. The voice recognition can be pretty inaccurate sometimes. If you're having problems triggering commands, you can use `/suggest` to notify JustBeChill.\n5. If you need help or have any questions, you can message `justbechill` to ask about it.\n\n**That's all! Enjoy Chill Bot!**";

//Create a new client
const client = new Client({ intents: [GatewayIntentBits.AutoModerationConfiguration, GatewayIntentBits.AutoModerationExecution, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent] });

//========================
//RUNS WHEN BOT IS READY
//========================
client.once(Events.ClientReady, c => {

    //Create connections object
    client.connections = {};

    const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    console.log(`\x1b[32mLOADING SERVERS\x1b[0m`);

    let count = 0;

    //Load servers and check that config is updated
    client.guilds.cache.forEach( guild => {
        if(!config[guild.id]) {
            config[guild.id] = baseServerConfig;
        }

        Object.keys(baseServerConfig).forEach(key => {
            if(!config[guild.id][key]) {
                config[guild.id][key] = baseServerConfig[key];
            }
        });
    
        count++;
    });
    
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
    console.log(`Loaded ${count} servers\n`)


    console.log("Heyo! Server up since")
    console.log(new Date().toLocaleString())

    client.guilds.fetch('824101797160419348')
        .then(guild => guild.members.fetch('464864064749961229')
        .then(member => client.me = member.user))

    changeStatus()

    client.setMaxListeners(0)
})



//Command handler
client.commands = new Collection();
slashCommands = [];

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for(const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    console.log("\x1b[1m");
    console.log(`\x1b[32mLOADING ${folder.toUpperCase()} COMMANDS\x1b[0m`);

    commandsLoaded = 0;

    const test = new Collection()
        .set('name', 'kys')

    //For every js file in commands
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath)
        command['folder'] = folder

        if(!'execute' in command) return;

        //Add command to collection if it has method and data
        if ('data' in command) {
            client.commands.set(command.data.name, command)
            console.log(command.data.name)

            //Add command to slashCommands if it is a slash command
            if(folder == 'slash') slashCommands.push(command.data.toJSON());

            commandsLoaded++;
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }

    console.log(`Loaded ${commandsLoaded} commands\n`)
}


//Loading slash commands
const rest = new REST().setToken(process.env.TOKEN);

(async () => {
    try {
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENTID),
            { body: slashCommands }
        )
        console.log(`Slash commands registered\n`)
    } catch(error) {
        console.error(error)
    }
})();

//When bot joins a server
client.on(Events.GuildCreate, guild => {
    const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

    if(!config[guild.id]) {
        config[guild.id] = baseServerConfig;
    }

    fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));

    let channel = null;

    guild.channels.cache.forEach(c => {
            if(c.type == 0) {
                channel = c;
                return;
            }
    });

    if(channel) channel.send(serverJoinMessage);
    console.log(`Joined ${guild.name}`)
});

//When slash command is used
client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if(!command) return;

    if(!commandIsEnabled(interaction.guild, interaction.commandName)) {
        await interaction.reply({ content: 'This command is disabled for this server.', ephemeral: true });
        return;
    }

    try {
		await command.execute(client, interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

//When message is sent
//FOR AUTO-REPLY COMMANDS
client.on(Events.MessageCreate, async message => {
    if(message.author.bot) return;

    const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

    if(config[message.guild.id] && config[message.guild.id].channels.counting) {
        client.commands.get('counting').execute(client, message);
    }

    //If message is a command
    client.commands.forEach(command => {
        if(command.folder == 'auto-reply') {

            //check if one of terms is in message
            for(const term of command.data.terms) {
                
                //run command
                if(message.content.toLowerCase().includes(term)) {

                    if(!commandIsEnabled(message.guild, command.data.name)) return;

                    command.execute(client, message);
                }
            }
        }
    });

    if(moment().day() != day) {
        changeStatus();
        day = moment().day();
    }
});

//When speech is detected
//FOR VOICE COMMANDS
/* client.on(SpeechEvents.speech, (message) => {
    if(!message.content || message.author.bot) return;

    const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

    if(config[message.guild.id] && config[message.guild.id].channels.transcript) {
        const channel = message.guild.channels.cache.get(config[message.guild.id].channels.transcript);

        if(channel) channel.send(`**${message.member.displayName}**: ${message.content}`);
    }

    //If message is a command
    client.commands.forEach(command => {
        if(command.folder == 'voice') {

            //check if one of terms is in message
            for(const term of command.data.terms) {

                //run command
                if(message.content.toLowerCase().includes(term)) {
                    if(!commandIsEnabled(message.guild, command.data.name)) return;

                    command.execute(client, message, term);
                }
            }
        }
    });
}); */

/**
 * Updates the status to a random element of collection `activities`
 */
function changeStatus() {
    activity = activities[Math.floor(Math.random() * activities.length)]

    client.user.setPresence({ activities: [{ name: activity.text, type: activity.type, url: activity.url }], status: 'online' });
}

/**
 * 
 * @param { The id of the guild to be checked } guild 
 * @param { the command name to be checked for } command 
 * @returns true if the command is enabled or not specified, false if the command is disabled.
 */
function commandIsEnabled(guild, command) {
    const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

    if(!config[guild.id]) return false;

    if(config[guild.id].commands[command] == undefined || config[guild.id].commands[command] == true) return true;

    return false;
}

//Log in with token, keep at end of file
client.login(process.env.TOKEN)