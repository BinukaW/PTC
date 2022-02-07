import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Button, Confirm, Icon } from 'semantic-ui-react';

import { FETCH_POSTS_QUERY } from '../util/graphql';
import PopupPreset from '../util/PopupPreset';

function DeleteButton({ postId, commentId, callback }) {
// When user clicks delete, confirm they want to perform this action before deleting
    const [confirmOpen, setConfirmOpen] = useState(false);

// Dynamically delete either comment or post depending on the ID
const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrMutation] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      if(!commentId){
        const data = proxy.readQuery({
            query: FETCH_POSTS_QUERY
          });
          data.getPosts = data.getPosts.filter((p) => p.id !== postId);
          proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
      }
      if (callback) callback();
    },
    variables: {
      postId,
      commentId

    }
  });
  return (
// Wrapped everything in a fragment to avoid errors as there are two sibling components in use
    <>
      <PopupPreset content={commentId ? "Delete message" : "Delete post"}>
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </PopupPreset>
{/* When user clicks delete, confirm they want to perform this action before deleting */}
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrMutation}
      />
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($postId: ID!, $commentId: ID!){
        deleteComment(postId: $postId, commentId: $commentId){
            id
            comments{
                id username createdAt body
            }
            commentCount
        }
    }
`

export default DeleteButton;