import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class MailService {
	constructor(private mailerService: MailerService) {}

	async sendResetPasswordLink(user: User, token: string) {
    	const url = `${process.env.DOMAIN}/change-password?token=${token}`;

    	return await this.mailerService.sendMail({
    	    to: user.email,
    	    subject: 'Գաղտնաբառի վերականգնում',
    	    template: 'reset-password',
    	    context: {
				name: user.name,
    	        url: url,
    	    },
    	});
	}
}