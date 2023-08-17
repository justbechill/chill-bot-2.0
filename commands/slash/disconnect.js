const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription('Disconnects the bot from the voice channel it is in.'),
        
    async execute(client, interaction) {
        
        if(!client.connections[interaction.guild.id]) {
            await interaction.reply({ content: "I'm not in a voice channel!", ephemeral: true});
            return;
        }

        const channel = interaction.member.voice.channel;

        client.connections[interaction.guild.id].destroy();
        delete client.connections[interaction.guild.id];

        await interaction.reply(`Disconnected from ${channel}!`);
    }
}