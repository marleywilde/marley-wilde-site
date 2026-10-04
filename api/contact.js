// Vercel serverless function: receives the contact form and emails it to you via Resend.
// Set these in Vercel → Project → Settings → Environment Variables:
//   RESEND_API_KEY  your Resend API key (resend.com → API Keys)
//   CONTACT_TO      where messages go, e.g. marleymoney593@gmail.com
//   CONTACT_FROM    optional sender, e.g. "Website <hello@yourdomain.com>" once your domain is verified in Resend.
//                   Until then it defaults to Resend's test sender, which can only send to the email on your Resend account.

const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const clean = (v, max) => String(v || '').trim().slice(0, max);
const escapeHtml = v => v.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Use POST.' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

  // Hidden field only bots fill in: pretend success so they move on.
  if (body.website) return res.status(200).json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const subject = clean(body.subject, 200) || 'New message from your website';
  const message = clean(body.message, 5000);

  if (!name || !message) return res.status(400).json({ error: 'Add your name and a message.' });
  if (!isEmail(email)) return res.status(400).json({ error: 'That email address doesn’t look right.' });

  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO) {
    return res.status(500).json({ error: 'The contact form isn’t set up yet.' });
  }

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: CONTACT_FROM || 'Website <onboarding@resend.dev>',
      to: [CONTACT_TO],
      reply_to: email,
      subject: `[Website] ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`
    })
  });

  if (!r.ok) {
    console.error('Resend error', r.status, await r.text());
    return res.status(502).json({ error: 'The message couldn’t be sent right now.' });
  }
  return res.status(200).json({ ok: true });
}
