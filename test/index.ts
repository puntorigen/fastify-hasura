import * as process
  from 'process'
import tap
  from 'tap'
import Fastify
  from 'fastify'
import {
  fastifyHasura,
} from '../src'

declare module 'fastify' {
  interface FastifyInstance {
    hasura: any
  }
}

function buildFastify(t) {
  const fastify = Fastify({logger: false})
  fastify.register(fastifyHasura, {
    hasura_base: 'http://localhost:8080',
    admin_secret: process.env.SECRET,
  })
  t.teardown(() => fastify.close())
  return fastify
}

tap.test('hasura', async t => {
  const fastify = buildFastify(t)
  await fastify.ready()
  t.type(fastify.hasura, 'object')
  t.type(fastify.hasura.metadata, 'object')
  t.type(fastify.hasura.schema, 'object')
  t.type(fastify.hasura.healthz, 'function')
  t.type(fastify.hasura.pgdump, 'function')
  t.type(fastify.hasura.graphql, 'function')
  // Throw nice error
  try {
    await fastify.hasura.graphql(
        `#graphql
			query test {
				test
			}`,
    )
  } catch (err) {
    // console.error(err)
    t.equal(err.statusCode, 200, 'Return statusCode 200')
    t.equal(
      err.message,
      `field "test" not found in type: 'query_root'`,
      'Throw nice error',
    )
  }
  try {
    const resp = await fastify.hasura.schema.sql({sql: `SELECT version();`}).run()
    // console.log(resp)
    t.equal(resp.result_type, 'TuplesOk', 'return TuplesOk')
    t.equal(resp.result?.[0]?.[0], 'version', 'result is a version info')
  } catch (err) {
    t.fail()
  }
  await fastify.close()
})
