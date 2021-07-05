const Users = require('../../models/users/users');
const bcrypt = require('bcryptjs');
const graphql = require('graphql');
const {
    GraphQLError
} = graphql;
const { generateToken } = require('../../utils/generateToken');

module.exports = async function SignUpUser (name, email, password, context)  {
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const payload = {
        "name": name,
        "email": email,
        "password": hashedPassword
    };

    let user = new Users(payload);

    try {
        return await Users.findOne({email: email}).then( async(resp) => {
            if (!(resp === null)) {
                return new GraphQLError("User already exists");
            } else {
               return await user.save().then((response) => {
                   return {
                       name: response.name,
                       email: response.email,
                       _id: response._id,
                        isDoctor:response.isDoctor,
                       accessToken: generateToken(response.name, response.email, response.isDoctor).Token,
                       rfsrt: generateToken(response.name, response.email, response.isDoctor).rfsrt
                   }
               })
               
            }
        })
    } catch(err){
        return new GraphQLError(err);
    }
};