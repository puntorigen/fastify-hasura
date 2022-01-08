import { FastifyPluginAsync } from 'fastify';
declare interface FastifyHasuraSDKOptions {
    hasura_base: string;
    admin_secret: string;
    api_graphql?: string;
    api_metadata?: string;
    api_health?: string;
    api_schema?: string;
    api_pgdump?: string;
}
export declare const fastifyHasura: FastifyPluginAsync<FastifyHasuraSDKOptions>;
export {};
