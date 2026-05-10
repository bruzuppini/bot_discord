require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

require('http')
  .createServer((req, res) => res.end('ok'))
  .listen(process.env.PORT || 3000);

  if (!process.env.TOKEN) {
  console.error("❌ TOKEN NÃO EXISTE NO RENDER");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const BOAS_VINDAS_ID = '1502872339396825230';
const LOGS_ID = '1502858327393042523';

client.on('clientReady', (client) => {
  console.log(`(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ Bot online como ${client.user.tag}`);
});

client.on('guildMemberAdd', (member) => {
  if (member.user.bot) return;

  const canal = member.guild.channels.cache.get(BOAS_VINDAS_ID);
  if (!canal || !canal.isTextBased()) return;

  const numeroMembro = member.guild.memberCount;

  const embed = new EmbedBuilder()
    .setColor('#ff9ecf')
    .setAuthor({
      name: member.user.tag,
      iconURL: member.user.displayAvatarURL()
    })
    .setDescription(`
╭───･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ───╮
✨ Olá, ${member}!
💖 Você é o membro nº **${numeroMembro}**!
🌸 Seja bem-vindo(a) à RESISTÊNCIA!
╰───･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ───╯
    `)
    .setThumbnail(member.user.displayAvatarURL())
    .setImage('https://i.pinimg.com/originals/df/aa/d1/dfaad160939b71b8b361b98e389f7b13.gif')
    .setFooter({
      text: `ID do usuário: ${member.user.id}`
    })
    .setTimestamp();

  canal.send({ embeds: [embed] });
});

client.on('messageDelete', (message) => {
  if (!message.guild || message.author?.bot) return;

  const canalLogs = message.guild.channels.cache.get(LOGS_ID);
  if (!canalLogs || !canalLogs.isTextBased()) return;

  const embed = new EmbedBuilder()
    .setColor('#ED4245')
    .setAuthor({
      name: message.author.tag,
      iconURL: message.author.displayAvatarURL()
    })
    .setDescription(`(╥﹏╥) 💔 Uma mensagem foi deletada!`)
    .addFields(
      { name: 'Conteúdo', value: message.content || '*sem texto*' }
    )
    .setFooter({
      text: `ID do usuário: ${message.author.id}`
    })
    .setTimestamp();

  canalLogs.send({ embeds: [embed] });
});

client.on('messageUpdate', (oldMsg, newMsg) => {
  if (!oldMsg.guild || oldMsg.author?.bot) return;
  if (oldMsg.content === newMsg.content) return;

  const canalLogs = oldMsg.guild.channels.cache.get(LOGS_ID);
  if (!canalLogs || !canalLogs.isTextBased()) return;

  const embed = new EmbedBuilder()
    .setColor('#FEE75C')
    .setAuthor({
      name: oldMsg.author.tag,
      iconURL: oldMsg.author.displayAvatarURL()
    })
    .setDescription(`( ⚆ _ ⚆ ) ✏️ Uma mensagem foi editada!`)
    .addFields(
      { name: 'Antes', value: oldMsg.content || '*sem texto*' },
      { name: 'Depois', value: newMsg.content || '*sem texto*' }
    )
    .setFooter({
      text: `ID do usuário: ${oldMsg.author.id}`
    })
    .setTimestamp();

  canalLogs.send({ embeds: [embed] });
});

client.on('guildMemberRemove', (member) => {
  if (member.user.bot) return;

  const canalLogs = member.guild.channels.cache.get(LOGS_ID);
  if (!canalLogs || !canalLogs.isTextBased()) return;

  const embed = new EmbedBuilder()
    .setColor('#ED4245')
    .setAuthor({
      name: member.user.tag,
      iconURL: member.user.displayAvatarURL()
    })
    .setDescription(`(｡•́︿•̀｡) 💔 A resistência foi traída...`)
    .addFields(
      { name: 'Status', value: `${member.user.tag} saiu!` }
    )
    .setFooter({
      text: `ID do usuário: ${member.user.id}`
    })
    .setTimestamp();

  canalLogs.send({ embeds: [embed] });
});

client.on('voiceStateUpdate', (oldState, newState) => {
  const canalLogs = newState.guild.channels.cache.get(LOGS_ID);
  if (!canalLogs || !canalLogs.isTextBased()) return;

  const user = newState.member.user;

  const base = new EmbedBuilder()
    .setAuthor({
      name: user.tag,
      iconURL: user.displayAvatarURL()
    })
    .setFooter({
      text: `ID do usuário: ${user.id}`
    })
    .setTimestamp();

  if (!oldState.channel && newState.channel) {
    const embed = base
      .setColor('#57F287')
      .setDescription(`👉 ${newState.member} entrou no canal de voz: **${newState.channel.name}**`);

    canalLogs.send({ embeds: [embed] });
  }

  if (oldState.channel && !newState.channel) {
    const embed = base
      .setColor('#ED4245')
      .setDescription(`👈 ${newState.member} saiu do canal de voz: **${oldState.channel.name}**`);

    canalLogs.send({ embeds: [embed] });
  }

  if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
    const embed = base
      .setColor('#FEE75C')
      .setDescription(`🔁 ${newState.member} trocou de canal de voz`)
      .addFields(
        { name: 'Saiu de', value: oldState.channel.name, inline: true },
        { name: 'Entrou em', value: newState.channel.name, inline: true }
      );

    canalLogs.send({ embeds: [embed] });
  }
});

client.login(process.env.TOKEN)
  .then(() => console.log("✅ LOGOU"))
  .catch(err => console.error("❌ ERRO AO LOGAR:", err));

client.login(process.env.TOKEN);

