const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
} = graphql;
const { mutation } = require('../mutations/mutation');
const { UserType } = require('../schemas/user');

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        user: {
            type: UserType,
            args: { _id: {type: GraphQLString}},
            resolve(parentValue, args) {
                //return _.find(users, {id: args.id});
                return "Hello World";
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: Query,
    mutation: mutation
});