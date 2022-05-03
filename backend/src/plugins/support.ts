import fp from 'fastify-plugin'
import connectDB, { IStore } from '../services/connectDB';
import registerJWT from '../services/registerJWT';
import verifyToken, { IPaylaod, ITokenUser } from '../services/verifyToken';

export interface SupportPluginOptions {
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify, opts) => {
  
  void await fastify.register(connectDB)
  void await fastify.register(registerJWT)
  void await fastify.register(verifyToken)
})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    store : IStore 
  }
}

declare module '@fastify/jwt'
{
  interface FastifyJWT 
  {
    paylaod : IPaylaod,
    user : ITokenUser
  }
}
