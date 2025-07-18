case 'mpesa':
  try {
    const devNumber = '254799963583';

    await ben.sendMessage(chatId, {
      text:
        `☕ To buy the developer coffee, kindly send KES (Any amount ☺️)
 via M-Pesa to:\n\n📱 *${devNumber}*
\n👤 Name: Kibet\nbut that isnt the name registered 😁\n📝 Reason: mpesa Boost 💥\n\n🙏 Thank you for your support!`,
      ...channelInfo
});

} catch (err) {
    await ben.sendMessage(chatId, {
      text: `⚠️ Error sending mpesa info: ${err.message}`,
      ...channelInfo
});
}
  break;
