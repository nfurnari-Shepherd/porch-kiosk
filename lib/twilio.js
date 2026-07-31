const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const FROM = process.env.TWILIO_FROM_NUMBER

export async function sendSMS(to, body) {
  if (!ACCOUNT_SID || !AUTH_TOKEN || !FROM) {
    console.error('Twilio env vars not set')
    return
  }
  if (!to) return

  const url = `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ To: to, From: FROM, Body: body }).toString(),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Twilio error:', err)
  }
}
