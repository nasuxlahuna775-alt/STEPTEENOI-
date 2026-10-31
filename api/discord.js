// Vercel Serverless Function: ส่งใบสมัครเข้า Discord
// ลิงก์เว็บฮุกเก็บใน Environment Variable ชื่อ DISCORD_WEBHOOK_URL (ไม่ได้อยู่ในหน้าเว็บ)
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false });
    return;
  }
  var hook = process.env.DISCORD_WEBHOOK_URL;
  if (!hook) {
    res.status(500).json({ ok: false, error: 'webhook not set' });
    return;
  }
  var b = req.body;
  if (typeof b === 'string') {
    try { b = JSON.parse(b); } catch (e) { b = {}; }
  }
  b = b || {};
  function cut(v, n) {
    var t = String(v == null ? '' : v).trim().slice(0, n);
    return t || '-';
  }
  var payload = {
    username: 'ใบสมัครสเต็ปตี๋น้อย',
    allowed_mentions: { parse: [] },
    embeds: [{
      title: 'ใบสมัครใหม่: ' + cut(b.gameName, 80),
      color: 0xff4d79,
      fields: [
        { name: 'ชื่อในเกม', value: cut(b.gameName, 200) },
        { name: 'Facebook', value: cut(b.facebook, 300) },
        { name: 'อีเมล', value: cut(b.email, 200) },
        { name: 'เคยเล่นแก๊ง', value: cut(b.exp, 1000) },
        { name: 'อาวุธ ไม้มีด', value: cut(b.weapon, 50), inline: true },
        { name: 'กินข้าวนอกบ้าน', value: cut(b.food, 50), inline: true },
        { name: 'เล่น 19.00-00.00 ได้', value: cut(b.time, 50), inline: true }
      ],
      timestamp: new Date().toISOString()
    }]
  };
  try {
    var r = await fetch(hook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    res.status(r.ok ? 200 : 502).json({ ok: r.ok });
  } catch (e) {
    res.status(502).json({ ok: false });
  }
};
