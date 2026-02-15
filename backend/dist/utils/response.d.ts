import { Response } from 'express';
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    timestamp?: string;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        [key: string]: any;
    };
}
export declare const sendSuccess: <T>(res: Response, data: T, message?: string, statusCode?: number, meta?: any) => Response;
export declare const sendError: (res: Response, error: string, statusCode?: number, details?: any) => Response;
export declare const sendCreated: <T>(res: Response, data: T, message?: string) => Response;
export declare const sendNoContent: (res: Response) => Response;
export declare const sendNotFound: (res: Response, resource?: string) => Response;
export declare const sendUnauthorized: (res: Response, message?: string) => Response;
export declare const sendForbidden: (res: Response, message?: string) => Response;
export declare const sendValidationError: (res: Response, errors: any) => Response;
export declare const sendConflict: (res: Response, message?: string) => Response;
export declare const sendServerError: (res: Response, message?: string) => Response;
export declare const sendPaginated: <T>(res: Response, data: T[], page: number, limit: number, total: number, message?: string) => Response;
export declare const parsePagination: (query: any) => {
    page: number;
    limit: number;
    skip: number;
};
export declare enum HttpStatus {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503
}
//# sourceMappingURL=response.d.ts.map