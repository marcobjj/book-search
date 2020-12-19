import React, { useState } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { useQuery,useMutation } from '@apollo/react-hooks';

import {QUERY_ME} from '../utils/queries'
import {DELETE_BOOK} from '../utils/mutations'


const SavedBooks = () => {

  const {loading,data} = useQuery(QUERY_ME)
  const [deleteBook,{error}] = useMutation(DELETE_BOOK);
  const [userData, setUserData] = useState({});
 

  const user = data?.me ;
  

  
  const userDataLength = Object.keys(userData).length;

  if  (user && !userDataLength) {
    setUserData(user);
   
  
  }

  

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const {data} = await deleteBook({
        variables: { bookId }
      });

  

      const user =  data['deleteBook'];


      if (!user) {
        throw new Error('something went wrong!');
      }

    
      const updatedUser = user;
      setUserData(updatedUser);
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => { 
          console.log(book)
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{ book.title}</Card.Title> 
                  <p className='small'>Authors: {book.authors}</p> 
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
        }

export default SavedBooks;
