import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import CommentOverview from './CommentOverview';

const COMMENTS_QUERY = gql`
  query {
    comments(page: {
      page: 0,
      size: 9999
    })
    {
      content {
        id,
        comment
        createdOn
        talk {
          title
        }
        author
      }
    }
  }
`;

const CommentFeed = () => (
  <Query
    query={COMMENTS_QUERY}
  >
    {props => <CommentOverview {...props} />}
  </Query>
);

export default CommentFeed;
