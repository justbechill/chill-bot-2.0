//Require packages
require('dotenv').config();

const { Client, Events, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const { addSpeechEvent, SpeechEvents } = require('discord-speech-recognition')
const fs = require('node:fs');
const path = require('node:path');

//Create a new client
const client = new Client({ intents: [GatewayIntentBits.AutoModerationConfiguration, GatewayIntentBits.AutoModerationExecution, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent] });
addSpeechEvent(client)

//When client is ready
client.once(Events.ClientReady, c => {
    console.log("Heyo! Server up since")
    console.log(new Date().toLocaleString())

    client.guilds.fetch('824101797160419348')
        .then(guild => guild.members.fetch('464864064749961229')
        .then(member => client.me = member.user))

    client.setMaxListeners(0)
})



//Command handler
client.commands = new Collection();
slashCommands = [];

const foldersPath = path.join(__dirname, 'Commands');
const commandFolders = fs.readdirSync(foldersPath);

for(const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    console.log("\x1b[1m");
    console.log(`\x1b[32mLOADING ${folder} COMMANDS\x1b[0m`);

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



//When slash command is used
client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if(!command) return;

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

    const channels = JSON.parse(fs.readFileSync('./servers.json', 'utf8'));

    if(channels[message.guild.id] && channels[message.guild.id].channels.counting) {
        client.commands.get('counting').execute(client, message);
    }

    //If message is a command
    client.commands.forEach(command => {
        if(command.folder == 'auto-reply') {

            //check if one of terms is in message
            for(const term of command.data.terms) {
                
                //run command
                if(message.content.toLowerCase().includes(term)) command.execute(client, message);
            }
        }
    });
});

//When speech is detected
//FOR VOICE COMMANDS
client.on(SpeechEvents.speech, (message) => {
    if(!message.content || message.author.bot) return;

    const channels = JSON.parse(fs.readFileSync('./servers.json', 'utf8'));

    if(channels[message.guild.id] && channels[message.guild.id].channels.transcript) {
        const channel = message.guild.channels.cache.get(channels[message.guild.id].channels.transcript);

        if(channel) channel.send(`**${message.member.displayName}**: ${message.content}`);
    }

    //If message is a command
    client.commands.forEach(command => {
        if(command.folder == 'voice') {

            //check if one of terms is in message
            for(const term of command.data.terms) {
                
                //run command
                if(message.content.toLowerCase().includes(term)) command.execute(client, message, term);
            }
        }
    });
});


//Log in with token, keep at end of file
client.login(process.env.TOKEN)