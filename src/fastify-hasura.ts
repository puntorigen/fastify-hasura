import hasuraSDK
  from '@ash0080/hasura-sdk'
import {
  FastifyPluginAsync,
} from 'fastify'
import fastifyPlugin
  from 'fastify-plugin'
import {
  GraphQLClient,
} from 'graphql-request'
import * as process
  from 'process'
import {
  URL,
} from 'url'

declare interface FastifyHasuraSDKOptions {
  hasura_base: string
  admin_secret: string
  api_graphql?: string
  api_metadata?: string
  api_health?: string
  api_schema?: string
  api_pgdump?: string
}

// Forked from https://github.com/ManUtopiK/fastify-hasura/blob/main/plugin.js
// Ugly error come from graphql-request! See here https://github.com/prisma-labs/graphql-request/blob/777cc55f3f772f5b527df4b7b4ae5f66006b30e9/src/types.ts#L29
// TODO Implement formatter ? https://github.com/mercurius-js/mercurius/blob/master/lib/errors.js
class GraphQLError extends Error {
  statusCode: number
  extensions: any
  variables: any
  query: any

  constructor({message}) {
    const err = message.split(': {"resp')
    const {
      response,
      request,
    } = JSON.parse(
      `{"resp${err[1]}`
        .replace(/\n/g, '')
        .replace(/field "(.*)" not/, 'field \'$1\' not'),
    )
    super(err[0])
    const {
      query,
      variables,
    } = request
    this.query = query
    this.variables = variables
    this.extensions = response?.errors[0]?.extensions
    this.statusCode = 200
  }
}

export const fastifyHasura: FastifyPluginAsync<FastifyHasuraSDKOptions> = fastifyPlugin(async (fastify, opts: FastifyHasuraSDKOptions) => {
  const sdk: { [key: string]: any } = {...hasuraSDK(opts)}

  const graphql_client = new GraphQLClient(new URL(opts.api_graphql || process.env.HASURA_API_GRAPHQL || '/v1/graphql', opts.hasura_base).toString(), {
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': opts.admin_secret,
    },
  })
  const graphql = async (query, variables) => {
    try {
      const hasura_dara = await graphql_client.request(query, variables)
      if (hasura_dara.length === 0) {
        throw new Error('Invalid request')
      }
      return hasura_dara
    } catch (err) {
      throw new GraphQLError(err)
    }
  }
  sdk.graphql = graphql
  fastify.decorate('hasura', Object.freeze(sdk))
})
