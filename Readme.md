# @ash0080/fastify-hasura

A [Fastify](https://github.com/fastify/fastify) plugin wrapping [@ash0080/hasura-sdk](https://github.com/ash0080/hasura-sdk) and [graphql-request](https://github.com/prisma-labs/graphql-request)
for [Hasura](https://github.com/hasura/graphql-engine)

So, by importing this plugin, you will have access to hasura's graphql, schema, metadata, healthz, pgdump , 5API's in total

## Installation
```yarn add @ash0080/fastify-hasura```
```pnpm add @ash0080/fastify-hasura```

## Features
This plugin covers most of the features of the official api's

See hasura's [official documentation](https://hasura.io/docs/latest/graphql/core/api-reference/index.html) for details

## Usage
```js
import fastifyHasura from '@ash0080/fastify-hasura'

fastify.register(fastifyHasura, {
  hasura_base: 'http://localhost:8080',
  admin_secret: 'your-secret',
  // ...other options
})

// then you can use
fastify.hasura.graphql(query, variables)
fastify.hasura.schema.sql({sql: 'select * from users'}).run()
fastify.hasura.metadata.source.add({})
fastify.hasura.healthz()
fastify.hasura.pgdump()
```

## API

Options:
```
declare interface FastifyHasuraSDKOptions {
  hasura_base: string    // required
  admin_secret: string   // required
  api_graphql?: string   // default: /v1/graphql
  api_metadata?: string  // default: /v1/metadata
  api_health?: string    // default: /healthz
  api_schema?: string    // default: /v2/query
  api_pgdump?: string    // default: /v1alpha1/pgdump
}
```

see [@ash0080/hasura-sdk](https://github.com/ash0080/hasura-sdk#api) doc
and [graphql-request](https://github.com/prisma-labs/graphql-request#examples) doc

## TODO
1. Maybe an auto process to generate Actions/Events/CronEvents handlers

## Changelog

The changelog can be found on the [Releases page](/releases).

## Contributing

Everyone is welcome to contribute. Please take a moment to review the [contributing guidelines](Contributing.md).

## Authors and license

[ash0080](Beorn) and [contributors](/graphs/contributors).

MIT License, see the included [License.md](License.md) file.
