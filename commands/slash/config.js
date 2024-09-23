const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChannelType, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');
const database = require('../../database');
const { config } = require('dotenv');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Configure settings for the bot.')
        .addSubcommand(subcommand =>
            subcommand.setName('channel')
            .setDescription('Set channels to different functions.')
            .addStringOption(option =>
                option.setName('type')
                .setDescription('The type of channel')
                .setRequired(true)
                .addChoices(
                    { name: 'Message', value: 'message' },
                    { name: 'Counting', value: 'counting' },
                    { name: 'Log', value: 'log' }
                )
            )
            .addChannelOption(option =>
                option.setName('channel')
                .setDescription('The channel to set.')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
            )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('command')
            .setDescription('enable or disable a command specifically for your server, just in case they get annoying.')
            .addStringOption(option =>
                option.setName('command')
                .setDescription('The name of the command you want to enable or disable')
                .setRequired(true)
            )
            .addBooleanOption(option =>
                option.setName('enable')
                .setDescription('True will enable the command, false will disable it.')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('permissions')
            .setDescription('Configure what permission is required to be able to configure settings. Administrator is required..')
            .addStringOption(option =>
                option.setName('permission')
                .setDescription('The minimum permission level required to configure settings.')
                .setRequired(true)
                .addChoices(
                    { name: 'Everyone', value: 'everyone' },
                    { name: 'Moderator', value: 'moderator' },
                    { name: 'Admin', value: 'admin' }
                )
            )
        ),
        
    async execute(client, interaction) {

        let config = await database.getServer(interaction.guild.id);

        const bitflag = config.requiredPermBitflag ? PermissionsBitField.Flags[config.requiredPermBitflag] : PermissionsBitField.Flags.Administrator;

        if(!interaction.member.permissions.has(bitflag)) {
            interaction.reply({ content: `You need to be a(n) \`${config.requiredPermLevel.toUpperCase()}\` to use this command.`, ephemeral: true });

            return;
        }

        if(interaction.options.getSubcommand() == 'channel') {
			channel(client, interaction, config);
		} else if(interaction.options.getSubcommand() == 'command') {
			command(client, interaction, config);
		} else if(interaction.options.getSubcommand() == 'permissions') {
            permissions(client, interaction, config);
        }
    }
}

function channel(client, interaction, config) {

    const type = interaction.options.getString('type').toLowerCase();
    const channel = interaction.options.getChannel('channel');

    if(type == 'message') {
        config.messageChannel = channel.id;
    } else if(type == 'counting') {
        config.countingChannel = channel.id;
    } else if(type == 'log') {
        config.logChannel = channel.id;
    } else {
        interaction.reply({content: 'There was a problem setting the channel.', ephemeral: true});
        return;
    }

    database.setServer(config);
    interaction.reply(`Set ${type} channel to ${channel}`);
}

function command(client, interaction, config) {

	command = interaction.options.getString('command');
	enable = interaction.options.getBoolean('enable');

	/* if(client.commands.has(command)) {
		config[interaction.guild.id].commands[command] = enable;
		fs.writeFileSync(path.resolve('./config.json'), JSON.stringify(config, null, 4));

		interaction.reply(`Set \`${command}\` to ${enable}`);
	} else {
		interaction.reply({ content: "That command could not be found. You can find the correct name for a command using `/help`.", ephemeral: true });
	} */
}

function permissions(client, interaction, config) {

    perm = interaction.options.getString('permission');

    let bitflag = null;

    if(perm == 'everyone') {
        bitflag = "SendMessages"
    } else if(perm == 'moderator') {
        bitflag = "ManageMessages"
    } else if(perm == 'admin') {
        perm = "administrator"
        bitflag = "Administrator"
    }

    config.requiredPermlevel = perm;
    config.requiredPermBitflag = bitflag;
    
    database.setServer(config);

    interaction.reply(`Set required permission level to \`${perm.toUpperCase()}\``);
}