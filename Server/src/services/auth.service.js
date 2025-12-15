import User from "../models/user.model.js";

//Service: Create a new user (Sign up)
export const createUser = async ({ name, email, password }) => {

  //Create and save User
  const user = await User.create({
    name,
    age,
    email,
    adharNumber,
    address,
    password
  })

  return user; //send back to controller
};