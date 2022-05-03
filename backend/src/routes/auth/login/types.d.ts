import { Type , Static } from "@sinclair/typebox";


const loginBody = Type.Object(
  {
    email : Type.String({ format : "email" }),
    password : Type.String()
  }
)

export type LoginBody = Static<typeof loginBody>