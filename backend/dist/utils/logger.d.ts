import winston from 'winston';
declare const logger: winston.Logger;
export declare const requestLogStream: {
    write: (message: string) => void;
};
export declare const loggers: {
    database: (action: string, metadata?: any) => void;
    api: (method: string, path: string, statusCode: number, duration: number, metadata?: any) => void;
    auth: (action: string, userId?: string, metadata?: any) => void;
    websocket: (event: string, metadata?: any) => void;
    cache: (action: string, key: string, metadata?: any) => void;
    business: (action: string, metadata?: any) => void;
};
export default logger;
//# sourceMappingURL=logger.d.ts.map