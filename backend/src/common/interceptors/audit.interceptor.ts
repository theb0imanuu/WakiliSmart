import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user || { id: null, username: 'System/Public' };
    const method = request.method;

    if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      const action = `${method}_${context.getHandler().name.toUpperCase()}`;
      const entityType = context.getClass().name.replace('Controller', '');

      return next.handle().pipe(
        tap(async (result) => {
          try {
            await this.prisma.auditLog.create({
              data: {
                user: user.id ? { connect: { id: user.id } } : undefined,
                username: user.username || user.fullName || user.email || 'System',
                action,
                entityType,
                entityId: result?.id ? Number(result.id) : null,
                details: JSON.stringify(request.body),
                ipAddress: request.ip,
              },
            });
          } catch (e) {
            console.error('Audit Log Error', e);
          }
        }),
      );
    }

    return next.handle();
  }
}
