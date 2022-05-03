import {Type , Static } from "@sinclair/typebox"


const registerBody = Type.Object(
  {
    email : Type.String({ format : "email" }),
    password : Type.String(),
    username : Type.String(),
  }
)

export type RegisterBody = Static<typeof registerBody>