const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChannelType, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

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
                    { name: 'Transcript', value: 'transcript' },
                    { name: 'Message', value: 'message' },
                    { name: 'Counting', value: 'counting' }
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

        obj = JSON.parse(fs.readFileSync(path.resolve('./servers.json')));

        const bitflag = obj[interaction.guild.id].permissions.bitflag ? PermissionsBitField.Flags[obj[interaction.guild.id].permissions.bitflag] : PermissionsBitField.Flags.Administrator;

        if(!interaction.member.permissions.has(bitflag)) {
            interaction.reply({ content: `You need to be a(n) \`${obj[interaction.guild.id].permissions.level.toUpperCase()}\` to use this command.`, ephemeral: true });

            return;
        }

        if(interaction.options.getSubcommand() == 'channel') {
			channel(client, interaction, obj);
		} else if(interaction.options.getSubcommand() == 'command') {
			command(client, interaction, obj);
		} else if(interaction.options.getSubcommand() == 'permissions') {
            permissions(client, interaction, obj);
        }
    }
}

function channel(client, interaction, obj) {

    if(!obj[interaction.guild.id]) {
        obj[interaction.guild.id] = {
            channels: {
                transcript: null,
                log: null,
                message: null,
                counting: null
            },
            permissions: {
                
            }
        }
    }

    const type = interaction.options.getString('type').toLowerCase();
    const channel = interaction.options.getChannel('channel');

    if(type == 'transcript') {
        obj[interaction.guild.id].channels.transcript = channel.id;
    } else if(type == 'message') {
        obj[interaction.guild.id].channels.message = channel.id;
    } else if(type == 'counting') {
        obj[interaction.guild.id].channels.counting = channel.id;
    } else {
        interaction.reply({content: 'There was a problem setting the channel.', ephemeral: true});
        return;
    }

    fs.writeFileSync(path.resolve('./servers.json'), JSON.stringify(obj, null, 4));
    interaction.reply(`Set ${type} channel to ${channel}`);
}

function command(client, interaction, obj) {

	command = interaction.options.getString('command');
	enable = interaction.options.getBoolean('enable');

	if(!obj[interaction.guild.id]) {
        obj[interaction.guild.id] = {
            channels: {
                transcript: null,
                log: null,
                message: null,
                counting: null
            },
            permissions: {
                
            }
        }
	}

	if(client.commands.has(command)) {
		obj[interaction.guild.id].commands[command] = enable;
		fs.writeFileSync(path.resolve('./servers.json'), JSON.stringify(obj, null, 4));

		interaction.reply(`Set \`${command}\` to ${enable}`);
	} else {
		interaction.reply({ content: "That command could not be found. You can find the correct name for a command using `/help`.", ephemeral: true });
	}
}

function permissions(client, interaction, obj) {

    perm = interaction.options.getString('permission');

    if(!obj[interaction.guild.id]) {
        obj[interaction.guild.id] = {
            channels: {
                transcript: null,
                log: null,
                message: null,
                counting: null
            },
			commands: {

			},
            permissions: {

            }
        }
	}

    let bitflag = null;

    if(perm == 'everyone') {
        bitflag = "SendMessages"
    } else if(perm == 'moderator') {
        bitflag = "ManageMessages"
    } else if(perm == 'admin') {
        perm = "administrator"
        bitflag = "Administrator"
    }

    obj[interaction.guild.id].permissions = {
        level: perm,
        bitflag: bitflag
    }
    
    fs.writeFileSync(path.resolve('./servers.json'), JSON.stringify(obj, null, 4));

    interaction.reply(`Set required permission level to \`${perm.toUpperCase()}\``);
}