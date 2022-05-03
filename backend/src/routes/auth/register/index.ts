import { FastifyPluginAsync } from "fastify";
import { hashPassword } from "../../../hooks/password";
import { RegisterBody } from "./types";

const register : FastifyPluginAsync =  async(fastify , options) => 
{ 
  fastify.post<{
    Body : RegisterBody
  }>("/" , async(request , reply) => 
  {
    const userInfo = request.body
    const { email , password , username } = userInfo

    if(!email || !password || !username)
    {
      throw fastify.httpErrors.badRequest("We lack information")
    }

    const hashedPassword = await hashPassword(password)
    userInfo.password = hashedPassword

    try {
      await fastify.store.User.create(userInfo ,  (err , user) => 
      {
        console.log({ user });
        
        if(err || !user)
          throw fastify.httpErrors.createError({ error : err , msg : "Error to register the user" })

        return reply.status(201).send(user)
      })      

      return reply.status(201).send("User created")
    } catch (error) {
      fastify.log.error({ error })
      fastify.httpErrors.badRequest("Error registering the user")
    }

  })
}

export default register