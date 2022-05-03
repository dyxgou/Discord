import { FastifyLoggerInstance, FastifyPluginAsync, FastifyRequest } from "fastify";
import { RouteGenericInterface } from "fastify/types/route";
import { IncomingMessage,  Server } from "http";

export interface IPaylaod
{
  userId : string
}

export interface ITokenUser
{
  id : string
}

type Req =  FastifyRequest<RouteGenericInterface, Server, IncomingMessage, unknown, FastifyLoggerInstance>

const verifyToken : FastifyPluginAsync = async(fastify , options) => 
{
  fastify.decorate("auth" , (request : Req) => 
  {
    try {
      request.jwtVerify()
    } catch (error) {
      throw fastify.httpErrors.unauthorized("Invalid Token")
    }
  })
}


export default verifyToken