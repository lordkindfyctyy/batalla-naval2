const express = require('express');
const twilio = require('twilio');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Configura tus credenciales de Twilio
const accountSid = 'TU_ACCOUNT_SID'; // De tu panel de Twilio
const authToken = 'TU_AUTH_TOKEN'; // De tu panel de Twilio
const client = new twilio(accountSid, authToken);

app.post('/send-otp', async (req, res) => {
    const { phoneNumber } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        await client.messages.create({
            body: `Tu código OTP para Lo de Lalo Pet Shop es: ${otp}`,
            from: 'whatsapp:+14155238886', // Tu número de WhatsApp de Twilio
            to: `whatsapp:${phoneNumber}`
        });

        global.otpStore = global.otpStore || {};
        global.otpStore[phoneNumber] = otp;

        res.json({ success: true });
    } catch (error) {
        console.error('Error enviando OTP:', error);
        res.json({ success: false, error: 'Error enviando OTP' });
    }
});

app.post('/verify-otp', (req, res) => {
    const { phoneNumber, otp } = req.body;
    const storedOTP = global.otpStore && global.otpStore[phoneNumber];

    if (otp === storedOTP) {
        delete global.otpStore[phoneNumber];
        res.json({ success: true });
    } else {
        res.json({ success: false, error: 'OTP incorrecto' });
    }
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});