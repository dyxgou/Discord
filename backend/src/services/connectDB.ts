import { FastifyPluginAsync } from "fastify"
import fp from "fastify-plugin"
import * as mongoose from "mongoose"
import UserSchema, { IUser } from "../schemas/UserSchema"

export interface IStore 
{
  User : mongoose.Model<IUser>,
  db : typeof mongoose
}

const connectDB : FastifyPluginAsync = fp(async(fastify , options) => 
{
  const URI = process.env.MONGO_URI

  if(!URI)
  {
    fastify.log.error("MONGO URI not found")
    process.exit(1)
  }

  await mongoose.connect(URI).then(connection => {
    fastify.decorate("store" , {
      User : connection.model("users" , UserSchema),
      db : connection
    })
  })

  process.on("uncaughtException" , (err) => {
    fastify.log.error({ err })
    
    mongoose.disconnect()
  })
})


export default connectDB