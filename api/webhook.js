export default async function handler(req, res) {
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'POST') {
    const body = req.body;

    if (body.object === 'instagram') {
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          if (change.field === 'comments') {
            const comment = change.value;
            const commentText = (comment.text || '').toLowerCase().trim();
            const keyword = (process.env.TRIGGER_KEYWORD || 'AI').toLowerCase();

            if (commentText.includes(keyword)) {
              await sendDM(comment.from.id, process.env.DM_MESSAGE || 'Here is your guide!');
            }
          }
        }
      }
    }

    return res.status(200).json({ status: 'ok' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function sendDM(recipientId, message) {
  const igUserId = process.env.INSTAGRAM_ACCOUNT_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  const response = await fetch(`https://graph.facebook.com/v21.0/${igUserId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message: { text: message },
      messaging_type: 'RESPONSE',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Failed to send DM:', JSON.stringify(error));
  }
}
