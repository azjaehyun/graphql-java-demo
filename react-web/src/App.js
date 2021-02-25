import React from 'react';
import CommentFeed from './CommentFeed';
import styled from 'styled-components';

const Container = styled.div`
  margin: auto;
  max-width: 1200px;
  font-size: 1.5em;
  color: #111;
`;

const Header = styled.h1`
  margin: 0;
  padding: 5px;
  text-align: center;
`;


const App = () => (
  <Container>
    <Header>graphql-react-demo</Header>
    <CommentFeed />
  </Container>
);

export default App;
