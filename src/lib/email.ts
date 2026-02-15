import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendVerificationCode(email: string, code: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #fff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 24px; font-weight: bold; color: #F97316;">DOMKRAT</span>
      </div>
      <h2 style="text-align: center; color: #333; margin-bottom: 8px;">Подтверждение email</h2>
      <p style="text-align: center; color: #666; margin-bottom: 24px;">
        Введите этот код на сайте для завершения регистрации:
      </p>
      <div style="text-align: center; margin: 24px 0;">
        <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #F97316; background: #FFF7ED; padding: 16px 32px; border-radius: 12px; display: inline-block;">
          ${code}
        </span>
      </div>
      <p style="text-align: center; color: #999; font-size: 14px;">
        Код действителен 10 минут. Если вы не регистрировались на Domkrat, проигнорируйте это письмо.
      </p>
    </div>
  `

  await transporter.sendMail({
    from: `"Domkrat" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: "Код подтверждения Domkrat",
    html,
  })
}
