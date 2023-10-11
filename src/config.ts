import { config as conf } from 'dotenv'

interface Config {
  port: string
  dbUser: string
  dbPassword: string
  dbServer: string
  dbDatabase: string
  dbConnectionLimit: number
  secret: string
  smtpHost: string
  smtpPort: string
  smtpUser: string
  smtpPassword: string
}

conf()

const config: Config = {
  port: process.env.PORT || '3001',
  dbUser: process.env.DB_USER || '',
  dbPassword: process.env.DB_PASSWORD || '',
  dbServer: process.env.DB_SERVER || '',
  dbDatabase: process.env.DB_DATABASE || '',
  dbConnectionLimit: process.env.DB_CONNECTION_LIMIT
    ? parseInt(process.env.DB_CONNECTION_LIMIT)
    : 4,
  secret: process.env.SECRET || '',
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: process.env.SMTP_PORT || '0',
  smtpUser: process.env.SMTP_USER || '',
  smtpPassword: process.env.SMTP_PASSWORD || '',
}

export default config
