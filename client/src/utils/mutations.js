import gql from 'graphql-tag';

export const ADD_BOOK = gql`
mutation addBook($bookId: String!, $title: String!,$link:String,$authors:[String],$image:String,$description:String) {
    addBook(bookId: $bookId, title: $title,link:$link,authors:$authors,image:$image,description:$description) {
      _id
      
      savedBooks {
        authors 
        bookId
        title
        link
        image
      }
    }
  }
`;



export const DELETE_BOOK = gql`
mutation  deleteBook($bookId: String!) {
    deleteBook(bookId: $bookId) {
      _id
      username
      email
      
      savedBooks {
        authors 
        bookId
        title
        link
        image
        description
      }
    }
    
  }`;

export const ADD_USER = gql`
mutation  addUser($username: String!,$email: String!, $password: String!)
{
 addUser(username: $username, email: $email, password: $password)
{
    token
    user {
      _id
    }
  

}


  
}`;


export const LOGIN = gql`
mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
  `;