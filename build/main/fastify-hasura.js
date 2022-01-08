"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastifyHasura = void 0;
const hasura_sdk_1 = __importDefault(require("@ash0080/hasura-sdk"));
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const graphql_request_1 = require("graphql-request");
const process = __importStar(require("process"));
const url_1 = require("url");
// Forked from https://github.com/ManUtopiK/fastify-hasura/blob/main/plugin.js
// Ugly error come from graphql-request! See here https://github.com/prisma-labs/graphql-request/blob/777cc55f3f772f5b527df4b7b4ae5f66006b30e9/src/types.ts#L29
// TODO Implement formatter ? https://github.com/mercurius-js/mercurius/blob/master/lib/errors.js
class GraphQLError extends Error {
    constructor({ message }) {
        const err = message.split(': {"resp');
        const { response, request, } = JSON.parse(`{"resp${err[1]}`
            .replace(/\n/g, '')
            .replace(/field "(.*)" not/, 'field \'$1\' not'));
        super(err[0]);
        const { query, variables, } = request;
        this.query = query;
        this.variables = variables;
        this.extensions = response?.errors[0]?.extensions;
        this.statusCode = 200;
    }
}
exports.fastifyHasura = (0, fastify_plugin_1.default)(async (fastify, opts) => {
    const sdk = { ...(0, hasura_sdk_1.default)(opts) };
    const graphql_client = new graphql_request_1.GraphQLClient(new url_1.URL(opts.api_graphql || process.env.HASURA_API_GRAPHQL || '/v1/graphql', opts.hasura_base).toString(), {
        headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret': opts.admin_secret,
        },
    });
    const graphql = async (query, variables) => {
        try {
            const hasura_dara = await graphql_client.request(query, variables);
            if (hasura_dara.length === 0) {
                throw new Error('Invalid request');
            }
            return hasura_dara;
        }
        catch (err) {
            throw new GraphQLError(err);
        }
    };
    sdk.graphql = graphql;
    fastify.decorate('hasura', Object.freeze(sdk));
}, '3.x');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFzdGlmeS1oYXN1cmEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmFzdGlmeS1oYXN1cmEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFFQUM0QjtBQUk1QixvRUFDdUI7QUFDdkIscURBRXdCO0FBQ3hCLGlEQUNnQjtBQUNoQiw2QkFFWTtBQVlaLDhFQUE4RTtBQUM5RSwrSkFBK0o7QUFDL0osaUdBQWlHO0FBQ2pHLE1BQU0sWUFBYSxTQUFRLEtBQUs7SUFNOUIsWUFBWSxFQUFDLE9BQU8sRUFBQztRQUNuQixNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFBO1FBQ3JDLE1BQU0sRUFDSixRQUFRLEVBQ1IsT0FBTyxHQUNSLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FDWixTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTthQUNkLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDO2FBQ2xCLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxrQkFBa0IsQ0FBQyxDQUNuRCxDQUFBO1FBQ0QsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2IsTUFBTSxFQUNKLEtBQUssRUFDTCxTQUFTLEdBQ1YsR0FBRyxPQUFPLENBQUE7UUFDWCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtRQUNsQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQTtRQUMxQixJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFBO1FBQ2pELElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFBO0lBQ3ZCLENBQUM7Q0FDRjtBQUVZLFFBQUEsYUFBYSxHQUFnRCxJQUFBLHdCQUFhLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUE2QixFQUFFLEVBQUU7SUFDdkksTUFBTSxHQUFHLEdBQTJCLEVBQUMsR0FBRyxJQUFBLG9CQUFTLEVBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQTtJQUV4RCxNQUFNLGNBQWMsR0FBRyxJQUFJLCtCQUFhLENBQUMsSUFBSSxTQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixJQUFJLGFBQWEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7UUFDbEosT0FBTyxFQUFFO1lBQ1AsY0FBYyxFQUFFLGtCQUFrQjtZQUNsQyx1QkFBdUIsRUFBRSxJQUFJLENBQUMsWUFBWTtTQUMzQztLQUNGLENBQUMsQ0FBQTtJQUNGLE1BQU0sT0FBTyxHQUFHLEtBQUssRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLEVBQUU7UUFDekMsSUFBSTtZQUNGLE1BQU0sV0FBVyxHQUFHLE1BQU0sY0FBYyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUE7WUFDbEUsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDNUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO2FBQ25DO1lBQ0QsT0FBTyxXQUFXLENBQUE7U0FDbkI7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLE1BQU0sSUFBSSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUE7U0FDNUI7SUFDSCxDQUFDLENBQUE7SUFDRCxHQUFHLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtJQUNyQixPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7QUFDaEQsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFBIn0=