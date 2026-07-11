import nodemailer from 'nodemailer';
import { AppLogger } from '@/core/logging/logger';
import { InfrastructureProvider } from '@/core/InfrastructureProvider';

export class EmailProvider implements InfrastructureProvider<EmailProvider> {
  public name = 'Email Provider';
  private transporter: nodemailer.Transporter;
  private logger = new AppLogger('EmailProvider');

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT || '587'),
      secure: process.env.MAIL_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  public getClient(): EmailProvider {
    return this;
  }

  public async connect(): Promise<void> {
    try {
      await this.transporter.verify();
      this.logger.info('Email transporter verified successfully');
    } catch (error) {
      this.logger.error('Email transporter verification failed', { error });
    }
  }

  public async disconnect(): Promise<void> {
    this.transporter.close();
  }

  public async sendOTP(to: string, otp: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM}>`,
        to,
        subject: 'Your Password Reset OTP',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #333; text-align: center;">Password Reset Verification</h2>
            <p style="color: #555; font-size: 16px;">Hello,</p>
            <p style="color: #555; font-size: 16px;">You recently requested to reset your password. Use the following One-Time Password (OTP) to proceed. This OTP is valid for <strong>10 minutes</strong>.</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="display: inline-block; padding: 15px 30px; font-size: 24px; font-weight: bold; color: #fff; background-color: #0056b3; border-radius: 4px; letter-spacing: 2px;">
                ${otp}
              </span>
            </div>
            <p style="color: #555; font-size: 16px;">If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">This is an automated message. Please do not reply to this email.</p>
          </div>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.info(`OTP Email sent successfully to ${to}`, { messageId: info.messageId });
      return true;
    } catch (error) {
      this.logger.error(`Failed to send OTP email to ${to}`, { error });
      return false;
    }
  }
}
