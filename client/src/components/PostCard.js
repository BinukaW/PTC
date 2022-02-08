import React, { useContext } from 'react';
import { Button, Card, Icon, Label, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { AuthContext} from '../context/auth';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import PopupPreset from '../util/PopupPreset';

function PostCard({
  post: { body, createdAt, id, username, likeCount, commentCount, likes }
}) {
  const { user } = useContext(AuthContext);

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://i.kym-cdn.com/photos/images/newsfeed/001/725/812/213.png"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
      <LikeButton user={user} post={{ id, likes, likeCount }} />
      <PopupPreset content="Message on this post">
        <Button as="div" labelPosition="right" as={Link} to={`/posts/${id}`}>
            <Button color="blue" basic>
              <Icon name="comments" />
            </Button>
            <Label basic color="blue" pointing="left">
              {commentCount}
            </Label>
          </Button>
      </PopupPreset>  
{/* If username = username of post means post is by this user */}
        {user && user.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
}

export default PostCard;