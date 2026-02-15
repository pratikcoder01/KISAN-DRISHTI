import { PrismaClient } from '@prisma/client';
export declare const getPrismaClient: () => PrismaClient;
export declare const connectDatabase: () => Promise<void>;
export declare const disconnectDatabase: () => Promise<void>;
export declare const checkDatabaseHealth: () => Promise<boolean>;
declare const _default: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export default _default;
//# sourceMappingURL=database.d.ts.map