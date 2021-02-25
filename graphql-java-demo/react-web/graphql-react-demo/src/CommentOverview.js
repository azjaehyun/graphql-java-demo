import React, { Component } from 'react';
import gql from 'graphql-tag';
import styled from 'styled-components';

const COMMENTS_SUBSCRIPTION = gql`
  subscription {
    comments {
      comment
      createdOn
      authorName
      talkTitle
    }
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CommentItem = styled.div`
  width: 700px;
  padding: 8px;
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
    author: { name },
    talk: { title }
  }} = props;

  return (
    <CommentItem>
      <Title>{name}</Title>
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

    const newComment = this.sanitizeCommentUpdateReponse(subscriptionData);

    return Object.assign({}, previousResult, {
      comments: {
        __typename: 'CommentPageableResponse',
        content: [...previousResult.comments.content, newComment]
      }
    });
  }

  sanitizeCommentUpdateReponse(subscriptionData) {
    const { talkTitle, authorName, ...commentData } = subscriptionData.data.comments;

    // The comment from the subscription returns talkTitle and authorName flattened.
    // Convert it to nested syntax to match query response
    // Also apollo-client crashes hard when we don't specifically define the __typenames....
    return {
      id: Date.now(), // Please add this to the contentUpdate response
      talk: {
        title: talkTitle,
        __typename: 'Talk',
      },
      author: {
        name: authorName,
        __typename: 'Person',
      },
      ...commentData,
    }
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
