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
    const tag = Math.floor(Math.random() * 9999)
    userInfo.tag = tag

    console.log(fastify.store , "user");
    
    await fastify.store.User.create(userInfo)    

    return reply.status(201).send("User created")
  })
}

export default register