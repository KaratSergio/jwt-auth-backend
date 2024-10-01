import userModel from '../models/user-model.js';

export async function checkIfUserExists(email) {
  return userModel.findOne({ email });
}
