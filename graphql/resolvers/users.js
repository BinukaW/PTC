const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { validateRegisterInput, validateLoginInput } = require('../../util/validators');
const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');

 // Jwt encryption
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
}

module.exports = {
  Mutation: {
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);
    // If not valid throw error
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
    //   Find username from db
      const user = await User.findOne({ username });
    // If no username found throw error
      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }
    //   Hash password prior to storing in db & create authentication token 
      const match = await bcrypt.compare(password, user.password);
    //   If wrong password throw error
      if (!match) {
        errors.general = 'Wrong crendetials';
        throw new UserInputError('Wrong crendetials', { errors });
      }
    //   If login is correct, issue token
      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      };
    },

    // parents is _ to save run space
    // args are defined in typeDefs.js RegisterInput
    async register(
      _,
      {
        registerInput: { username, email, password, confirmPassword }
      }
    ) {
      // Validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
      // Make sure user doesnt already exist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken'
          }
        });
      }
      // hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
      });
      
      // Save new user to the DB
      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token
      };
    }
  }
};
