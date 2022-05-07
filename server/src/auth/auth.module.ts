import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';

@Module({
	imports: [
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '1h' },
		}),
		forwardRef(() => UsersModule),
		MailModule
	],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService, JwtModule],
})
export class AuthModule {}
