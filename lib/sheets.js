import { JWT } from 'google-auth-library'

async function getAccessToken() {
  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS)
  const client = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  const token = await client.getAccessToken()
  return token.token
}

export async function appendRegistration({ name, service, zipCode, phone }) {
  const token = await getAccessToken()
  const sheetId = process.env.GOOGLE_SHEET_ID
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'America/Indiana/Indianapolis',
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A:E:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [[name, service, zipCode, phone || '', timestamp]],
      }),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Sheets API error: ${err}`)
  }
}
