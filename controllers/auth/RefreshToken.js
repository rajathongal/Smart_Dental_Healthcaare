const Users = require('../../models/users/users');
const graphql = require('graphql');
const {
    GraphQLError
} = graphql;
const jwt = require('jsonwebtoken');
const { generateToken } = require('../../utils/generateToken');


module.exports = async function RefreshAccess (args,context) {
    
   
    const token = args.token;
  
    if(!token){
        return new GraphQLError("NOTOKEN");
    }

    return await jwt.verify(token, "jjeejffjdskngjdii384y67492nfjdnn", { algorithm: "HS256" }, async function(err, decoded){
        
        if(err){
            return new GraphQLError("INVALIDTOKEN");
        }
        if(decoded){
            
            return await Users.findOne({email: decoded.email}).then(async (res) => {
                
                if(res === null){
                    return new GraphQLError("INVALIDUSER");
                } else{
                   
                    return {
                        name: res.name,
                        email: res.email,
                        _id: res._id,
                        accessToken:  await generateToken(res.name, res.email, res._id, res.isDoctor).Token
                    }
                }
            });
        }
    });
};