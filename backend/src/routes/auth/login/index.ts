import { FastifyPluginAsync } from "fastify";
import { comparePassword } from "../../../hooks/password";
import { LoginBody } from "./types";

const login : FastifyPluginAsync = async(fastify , options) => 
{
  fastify.post<{
    Body : LoginBody
  }>("/" ,  async(request , reply) => 
  {
    const { email , password } = request.body

    if(!email || !password)
    {
      throw fastify.httpErrors.badRequest("We lack information")
    }

    const user = await fastify.store.User.findOne({ email } , {
      _id  : true , password : true
    })

    const isCorrectPassword = await comparePassword(user?.password , password)

    if(!user || !isCorrectPassword)
    {
      throw fastify.httpErrors.unauthorized("Email or password is wrong")
    }

    const SERVEN_DAYS = 60 * 60 * 24 * 7

    const token = fastify.jwt.sign({ userId : user?.id } , {
      expiresIn : SERVEN_DAYS
    })

    return reply.status(200).send({ token })
  })
}

export default login