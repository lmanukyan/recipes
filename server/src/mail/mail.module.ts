import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';

@Module({
	imports: [
		ConfigModule.forRoot(),
    	MailerModule.forRoot({
			transport: {
				host: process.env.SMTP_HOST,
				secure: process.env.SMTP_SECURE === 'yes' ? true : false,
				auth: {
					user: process.env.SMTP_FROM,
					pass: process.env.SMTP_PASS,
				},
			},
    		defaults: {
    			from: `Notifier <${process.env.SMTP_FROM}>`,
    		},
			template: {
				dir: join(__dirname, 'templates'),
				adapter: new HandlebarsAdapter(), 
				options: {
					strict: true,
				},
			},
    	}),
	],
	providers: [MailService],
	exports: [MailService], 
})
export class MailModule {}