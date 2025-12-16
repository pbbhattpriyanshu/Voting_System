import User from "../models/user.model.js";

//Service: Create a new user (Sign up)
export const createUser = async ({ name, role, email, password, age, adharNumber, phone, address }) => {

  //Create and save User
  const user = await User.create({
    name,
    age,
    email,
    adharNumber,
    address,
    password,
    phone,
    role
  })

  return user; //send back to controller
};