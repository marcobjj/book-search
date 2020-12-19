const { User, bookSchema } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
              const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
               // .populate('savedBooks')
          
              return userData;
              
            }
          
            throw new AuthenticationError('Not logged in');
          },
        // get all users
        users: async () => {
            return User.find()
                .select('-__v -password')
             //   .populate('savedBooks')
        },
        // get a user by username
        user: async (parent, { username }) => {
            return User.findOne({ username })
                .select('-__v -password')
             //   .populate('savedBooks')

        },
    },
    Mutation: {
  
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
          
            return { token, user };
          },
                
      addBook: async (parent,  body, context) => {

            if (context.user) {
              const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $push: { savedBooks: body } },
                { new: true }
              )
              
              //.populate('savedBooks');


       
              return updatedUser;
            }
          
            throw new AuthenticationError('You need to be logged in!');
          },
          deleteBook: async (parent, body, context) => {
            console.log("body", body)
            const updatedUser = await User.findOneAndUpdate(
              { _id: context.user._id },
              { $pull: { savedBooks: { bookId: body.bookId } } },
              { new: true }
            );
            if (!updatedUser) {
              return ({ message: "Couldn't find user with this id!" });
            }
            return updatedUser;
          },
          login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            
          
            if (!user) {
              throw new AuthenticationError('Incorrect credentials');
            }
          
            const correctPw = await user.isCorrectPassword(password);
          
            if (!correctPw) {
              throw new AuthenticationError('Incorrect credentials');
            }
          
            const token = signToken(user);
            return { token, user };
          }
}
}

module.exports = resolvers;