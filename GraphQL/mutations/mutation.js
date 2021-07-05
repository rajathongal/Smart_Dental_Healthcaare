const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLList,
    GraphQLError
} = graphql;

const { UserType } = require('../schemas/user');
const SignIn = require('../../controllers/auth/SignIn');
const SignUpUser = require('../../controllers/auth/SignUpPatient');
const RefreshAccess = require('../../controllers/auth/RefreshToken');

exports.mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        signInUser: {
            type: UserType,
            args: {
                email: { type: new GraphQLNonNull(GraphQLString)},
                password: { type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue, {email, password}, context) {
               return SignIn(email, password).then(resp =>{
                   context.res.setHeader('Authorization', `Bearer ${resp.accessToken}`)
                   return resp;
               }).catch(err => {return new GraphQLError(err)})
            }
        },
        signUpUser: {
            type: UserType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString)},
                email: { type: new GraphQLNonNull(GraphQLString)},
                password: { type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parentValue, {name, email, password}, context) {
               
                return SignUpUser(name, email, password, context).then(resp =>{
                    //context.res.cookie('accesstoken', resp.accesstoken, {httpOnly: true});
                    //context.res.cookie('rfsrt', resp.rfsrt, {httpOnly: true});
                    context.res.setHeader('Authorization', `Bearer ${resp.accessToken}`)
                    return resp;
                });
            }
        },
        Refresh: { 
            type: UserType,
            args: {
                token: { type: new GraphQLNonNull(GraphQLString)},
            },
            async resolve(parentValue, args, context) {
                
                return await RefreshAccess(args,context).then(resp => {
                    context.res.setHeader('Authorization', `Bearer ${resp.accessToken}`)
                    return resp
                }).catch(err => console.log(err))
            }
        },
    }
});