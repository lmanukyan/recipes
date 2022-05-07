import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, SetMetadata } from "@nestjs/common";
import { Reflector } from '@nestjs/core';
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        try {
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]
            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({message: 'Օգտատերը ավտորիզացված չէ'})
            }
            const user = this.jwtService.verify(token);
            req.user = user;
            return roles.includes(user?.role);
        } catch (e) {
            throw new UnauthorizedException({message: 'Օգտատերը ավտորիզացված չէ'})
        }
    }
}

export const Roles = (roles: string[]) => SetMetadata('roles', roles);
