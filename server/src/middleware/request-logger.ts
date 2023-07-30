import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger('[HTTP]');

    use(request: Request, response: Response, next: NextFunction): void {
        const { method, body } = request;
        this.logger.debug('+-Request', { method, body });

        next();
    }
}
