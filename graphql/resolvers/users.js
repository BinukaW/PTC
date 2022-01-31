const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { SECRET_KEY } = require('../../config')
const User = require('../../models/User');

module.exports = {
    Mutation: {
        // parents is _ to save run space
        // args are defined in typeDefs.js RegisterInput
        async register(
            _,
            { 
                 registerInput : username, email, password, confirmPassword 
            }, 
            context, 
            info
        )   {
            // TODO: Validate user data
            // TODO: Ensure user doesn't already exist
            // TODO: Hash password prior to storing in db & create authentication token 
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Data().toISOString()
            });

            // Save new user to the DB
            const res = await newUser.save();
            // Jwt encryption
            const token = jwt.sign(
                {
                    id: res.id,
                    email: res.email,
                    username: res.username
                },  
                    SECRET_KEY, 
                        { expiresIn: '1h'}
                );
            
            return {
                ...res._doc,
                id: res._id,
                token
            };
        }
    }
};