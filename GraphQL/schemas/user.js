const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLList,
    GraphQLInt
} = graphql;

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        _id: {type: GraphQLString},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        accessToken: {type: GraphQLString},
        rfsrt: {type: GraphQLString},
        isDoctor: {type: GraphQLBoolean}
    })
});

const ImageResponse = new GraphQLObjectType({
    name: 'ImageResponse',
    fields: () => ({
        success: {type: GraphQLBoolean}
    })
});

module.exports = {UserType, ImageResponse}