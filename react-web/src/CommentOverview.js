import React, { Component } from 'react';
import gql from 'graphql-tag';
import styled from 'styled-components';

const COMMENTS_SUBSCRIPTION = gql`
  subscription {
    comments {
      id,
      comment
      createdOn
      talk {
        title
      }
      author
    }
  }
`;


const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CommentItem = styled.div`
  padding: 16px;
  margin-bottom: 16px;
  display: grid;

  grid-template-rows: 1em 1em 1fr;
  grid-template-columns: repeat(8, 1fr);

  background: #FFF;
  border-radius: 8px;
`;

const Title = styled.h3`
  margin: 0;
  grid-row: 1;
  color: black;
  font-size: 0.8em;
  grid-column: 1 / 4;
`;

const Talk = styled.p`
  margin: 0;
  grid-row: 2;
  color: gray;
  font-size: 0.8em;
  grid-column: 1 / -1;
`;

const Timestamp = styled.p`
  margin: 0;
  font-size: 0.8em;
  text-align: right;
  color: gray;
  grid-row: 1;
  grid-column: 4 / -1;
`;

const Content = styled.p`
  margin: 0;
  margin-top: 1em;
  grid-row: 3;
  grid-column: 1 / -1;
`;

const Comment = (props) => {
  const { data: {
    comment,
    createdOn,
    author,
    talk: { title }
  }} = props;

  return (
    <CommentItem>
      <Title>{author}</Title>
      <Timestamp>{createdOn.substr(11, 12)}</Timestamp>
      <Talk>[{title}]</Talk>
      <Content>{comment}</Content>
    </CommentItem>
  );
}

class CommentOverview extends Component {
  componentDidMount() {
    this.subscribeToNewComments();
  }

  subscribeToNewComments() {
    const { subscribeToMore } = this.props;

    subscribeToMore({
      document: COMMENTS_SUBSCRIPTION,
      updateQuery: this.handleUpdate,
    })
  }

  handleUpdate = (previousResult, { subscriptionData }) => {
    if (!subscriptionData.data) {
      return previousResult;
    }

    const newComment = subscriptionData.data.comments;

    return Object.assign({}, previousResult, {
      comments: {
        __typename: 'CommentPageableResponse',
        content: [newComment, ...previousResult.comments.content]
      }
    });
  }

  render() {
    const { data, loading } = this.props;

    if (loading) {
      return <p>Loading...</p>
    }
    if (!data) {
      return <p>No data received...</p>
    }
    return (
      <List>
        {data.comments.content.map(comment => (
          <Comment data={comment} key={comment.id} />
        ))}
      </List>
    );
  }
}

export default CommentOverview;
