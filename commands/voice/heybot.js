const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const yt = require('usetube')
const ytdl = require('ytdl-core')

module.exports = {
    data: {
        name: 'hey bot',
        description: 'Very basic voice assistant-type stuff. Say "hey bot play -----" to play a song.',
        terms: ['hey bot', 'hey bop', 'hey boss', 'a bot']
    },

    async execute(client, message, term) {
        let args = message.content.slice(term.length).split(" ")
        args.shift();
        let command = args.shift();

        //play songs
        if(command == "play") {
            const res = await yt.searchVideo(args.join(" "))
            url = 'https://www.youtube.com/watch?v=' + res.videos[0].id
        }

        const stream = ytdl(url, { filter: 'audioonly' })

        const player = createAudioPlayer();
        const resource = createAudioResource(stream)

        client.connection.subscribe(player);
        player.play(resource)
    }
    
}