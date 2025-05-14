const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'alphonso.gerhold@ethereal.email',
        pass: 'bhxja1AhcMS7BVyDuV'
    }
});

/**
 * Kayıt olan kullanıcıya karşılama e-postası gönderir.
 * @param {string} to - Alıcının e-posta adresi
 * @param {string} userName - Kullanıcının adı
 */
async function sendWelcomeEmail(to, userName) {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to Our Platform, ${userName}!</h2>
        <p>We're excited to have you on board. Let us know if you need any help getting started.</p>
        <br/>
        <small>This is an automated message. Please do not reply.</small>
      </div>
    `;

    const info = await transporter.sendMail({
      from: '"Auth App" <no-reply@example.com>',
      to,
      subject: 'Welcome to Our Platform!',
      html,
      text: `Welcome, ${userName}! We're excited to have you on board.`
    });

    console.log('Welcome email sent:', info.messageId);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
}



/**
 * Şifre sıfırlama kodunu içeren e-posta gönderir.
 * @param {string} to - Alıcının e-posta adresi
 * @param {string|number} code - Şifre sıfırlama kodu
 */
async function sendResetCodeEmail(to, code) {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h3>Password Reset Request</h3>
        <p>Your reset code is:</p>
        <h1 style="color: #e91e63;">${code}</h1>
        <p>Please enter this code to reset your password. This code is valid for a limited time.</p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: '"Auth App" <no-reply@example.com>',
      to,
      subject: `${code}`, // Mail başlığı olarak kod gönderiliyor
      html,
      text: `Your password reset code is: ${code}`
    });

    console.log('Reset code email sent:', info.messageId);
  } catch (error) {
    console.error('Failed to send reset code email:', error);
    throw error;
  }
}


module.exports = { sendResetCodeEmail,sendWelcomeEmail };  