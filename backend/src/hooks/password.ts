import * as bcrypt from "bcrypt"

export const hashPassword = async(password : string) => 
{
  const salt = await bcrypt.genSalt(10)

  const hashedPassword = await bcrypt.hash(password , salt)

  return hashedPassword
}

export const comparePassword = async(hashedPassword : string | undefined , password : string) =>  
{
  if(!hashedPassword)
    return false
  
  const isCorrectPassword = await bcrypt.compare(password , hashedPassword)

  return isCorrectPassword
}