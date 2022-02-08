import React, { useContext, useState, useRef } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import moment from 'moment';
import { Button, Card, Form, Grid, Image, Icon, Label } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import PopupPreset from '../util/PopupPreset';

function SinglePost(props) {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);
  const commentInputRef = useRef(null);

  const [comment, setComment] = useState('');

  const {
    loading,
    // data: { getPost }
    data
  } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId
    }
  });

  console.log("Testing data collection", data)

// On submitting the message, clear the field
const [submitComment] = useMutation(CREATE_COMMENT_MUTATION, {
    update(){
        setComment('');
// After posting message, blur the compose message field
        commentInputRef.current.blur();
    },
    variables: {
        postId,
        body: comment
    }
});

// deletePostCallback directs user back to Home upon deleting
  function deletePostCallback() {
    props.history.push('/Home');
  }

  let postMarkup;
  // if (//!data.getPost) {
  //   postMarkup = <p>Loading post..</p>;
  // } else {
  //   const {
  //     id,
  //     body,
  //     createdAt,
  //     username,
  //     comments,
  //     likes,
  //     likeCount,
  //     commentCount
  //   } = data.getPost;

    postMarkup = (
      loading? <h1>LOADING</h1>:
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              size="small"
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{data.getPost.username}</Card.Header>
                <Card.Meta>{moment(data.getPost.createdAt).fromNow()}</Card.Meta>
                <Card.Description>{data.getPost.body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                {/* <LikeButton user={data.getPost.user} post={{ id, likeCount, likes }} /> */}
                <PopupPreset content="Message on post">
                  <Button
                    as="div"
                    labelPosition="right"
                    onClick={() => console.log('Comment on post')}
                  >
                    <Button basic color="blue">
                      <Icon name="comments" />
                    </Button>
                    <Label basic color="blue" pointing="left">
                      {data.getPost.commentCount}
                    </Label>
                  </Button>
                </PopupPreset>
                {user && user.username === data.getPost.username && (
// deletePostCallback directs user back to Home upon deleting
                  <DeleteButton postId={data.getPost.id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>

            {user && <Card fluid>
                <Card.Content>
                <p>Post a message</p>
                <Form>
                    <div className="ui action input fluid">
                        <input 
                            type="text"
                            placeholder="Message..."
                            name="comment"
                            value={comment}
                            onChange={event => setComment(event.target.value)}
                            ref={commentInputRef}
                        />
                        <button 
                            type="submit"
                            className="ui button teal"
                            disabled={comment.trim() === ''}
                            onClick={submitComment}
                        >
                            Submit
                        </button>
                    </div>
                </Form>
                </Card.Content>
            </Card>}

            {data.getPost.comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
{/* Allow user who owns this comment access to delete button */}
                  {user && user.username === comment.username && (
                    <DeleteButton postId={data.getPost.id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  
  return postMarkup;
//return <h1>Testing</h1>;
}

// Mutations
const CREATE_COMMENT_MUTATION = gql`
    mutation($postId: String!, $body: String!){
        createComment(postId: $postId, body: $body){
            id 
            comments{
                id body createdAt username
            }
            commentCount
        }
    }
`

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;