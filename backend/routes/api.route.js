const router = require('express').Router();
const { google } = require('googleapis');

const GOOGLE_CLIENT_ID = '1047388141440-qtrqho9465qrsn4t7igej0umdcq0dug8.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const REFRESH_TOKEN = '1//06PwRPt6IZaaRCgYIARAAGAYSNgF-L9IrMhI49wSyaXA_yOBywrMO2hlUsmsSg7-dJLf3Mw91mcEneJ35U6oBbCdl7dSWD8siOw'

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  'http://localhost:3000'
)

router.get('/', async (req, res, next) => {
  res.send({ message: 'Ok api is working 🚀' });
});

router.post('/create-tokens', async (req, res, next) => {
  try {
    const { code } =  req.body;
    const { tokens } = await oauth2Client.getToken(code)
    res.send(tokens)
  } catch (error) {
    next(error)
  }
})

router.post('/create-event', async (req, res, next) => {
  try {
    const { summary, description, location, startDateTime, endDateTime } = req.body;
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    const calendar = google.calendar('v3')
    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: 'primary',
      requestBody: {
        summary: summary, 
        description: description,
        location: location,
        colorId: '7',
        start: {
          dateTime: new Date(startDateTime),
        },
        end: {
          dateTime: new Date(endDateTime)
        },
      }
    })
    res.send(response)
  } catch (error) {
    next(error)
  }
})

module.exports = router;
