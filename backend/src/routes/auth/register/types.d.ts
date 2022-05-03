import {Type , Static } from "@sinclair/typebox"


const registerBody = Type.Object(
  {
    email : Type.String({ format : "email" }),
    password : Type.String(),
    username : Type.String(),
    tag : Type.Number({ exclusiveMaximum : 9999 })
  }
)

export type RegisterBody = Static<typeof registerBody>