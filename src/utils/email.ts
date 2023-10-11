import nodemailer from 'nodemailer'
import config from '../config'

const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: parseInt(config.smtpPort),
  secure: false,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPassword,
  },
})

const getHtmlMessage = (domain: string, token: string) => `
  <p>Hello,</p>
  <p>We have received a request to reset your password. Click the following link to reset your password:</p>
  <a href="${domain}/reset-password/${token}">Reset Password</a>
  <p>If you did not request a password reset, please ignore this message.</p>
`

export const sendPasswordResetEmail = async (
  email: string,
  domain: string,
  token: string,
): Promise<boolean> => {
  try {
    const info = await transporter.sendMail({
      from: config.smtpUser,
      to: email,
      subject: 'Password reset',
      html: getHtmlMessage(domain, token),
    })

    console.log(`Email sent: ${info.messageId}`)

    return true
  } catch (error) {
    console.log(`Error sending password reset email to ${email}: ${error}`)

    return false
  }
}

export const sendUserEmail = async (
  email: string,
  message: string,
  subject: string,
): Promise<boolean> => {
  try {
    const info = await transporter.sendMail({
      from: config.smtpUser,
      to: email,
      subject,
      html: message,
    })

    console.log(`Email sent: ${info.messageId}`)

    return true
  } catch (error) {
    console.log(`Error sending email to ${email}: ${error}`)

    return false
  }
}
