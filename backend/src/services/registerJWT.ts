import { FastifyPluginAsync } from "fastify"
import jwt from "@fastify/jwt"

const registerJWT : FastifyPluginAsync = async(fastify , options) => 
{
  const JWT_SECRET = process.env.JWT_SECRET
  
  if(!JWT_SECRET)
  {
    fastify.log.error("JWT SECRET not found")
    process.exit(1)
  }

  fastify.register(jwt , {
    secret : JWT_SECRET,
  })

  fastify.log.info("JWT is ready!")
}


export default registerJWT