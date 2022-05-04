import { FastifyLoggerInstance , FastifyPluginAsync, FastifyRequest } from "fastify";
import { RouteGenericInterface } from "fastify/types/route";
import { IncomingMessage,  Server } from "http";
import fp from "fastify-plugin"

export interface IPaylaod { userId : string }

export interface ITokenUser { userId : string , iat : number , exp : number }

export type VerifyToken = (request : Req) => {}

type Req =  FastifyRequest<RouteGenericInterface, Server, IncomingMessage, unknown, FastifyLoggerInstance>

const verifyToken : FastifyPluginAsync = fp(async(fastify , options) => 
{
  fastify.decorate("auth" , async(request : Req) => 
  {
    try {
      await request.jwtVerify()
    } catch (error) {
      console.error({ error })

      throw fastify.httpErrors.unauthorized("Invalid Token")
    }
  })
})


export default verifyToken