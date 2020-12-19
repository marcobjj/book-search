// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs

const typeDefs = gql`

  type bookSchema {
    bookId: String

    authors: [String]
    
    description: String
    
    title: String
    
    image:String
    
    link: String
  }

  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [bookSchema]
  }

  type Query {
    me: User
    users: [User]
    user(username: String!): User

  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addBook(bookId: String!, title:String!, link: String,authors:[String],description:String,image:String): User
    deleteBook(bookId: String!):User
  }
  

  type Auth {
    token: ID!
    user: User
  }
`;

// export the typeDefs
module.exports = typeDefs;