const Users = require('../../models/users/users');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../../Utils/generateToken');
const graphql = require('graphql');
const {
    GraphQLError
} = graphql;

module.exports = async function SignIn (email, password) {
   
    try{
        return await Users.findOne({email: email}).then( async(response) => {
            if(response === null){
                return new GraphQLError("User Does Not Exist");
            } else {
                const isMatch = bcrypt.compareSync(password, response.password);
                if (isMatch){
                    return {
                        name: response.name,
                        email: response.email,
                        _id: response._id,
                        accessToken: await generateToken(response.name, response.email, response._id, response.isDoctor).Token,
                        rfsrt: await generateToken(response.name, response.email, response.isDoctor).rfsrt,
                        
                    }
                } else {
                    return new GraphQLError("Wrong email or password")
                }
                
            }
        });
    } catch(err){
        return new GraphQLError(err)
    }
    
};