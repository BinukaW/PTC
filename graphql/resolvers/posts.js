const { AuthenticationError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');

module.exports = {
    Query: {
        async getPosts(){
            
            try{
                const posts = await Post.find().sort({ createdAt: -1});
                return posts;
            } catch(err){
                throw new Error(err);
            }
        },
        async getPost(_, { postId }){
console.log('getPost', postId);
            try{
                const post = await Post.findById(postId);
                if(post){
                    return post;
                } else {
                    throw new Error('Post not found.');
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
    // Context allows us to access the request body and confirm user is authenticated
        async createPost(_, { args }, context){
            const user = checkAuth(context);
            console.log(context.req.body, "context");
            
            if (context?.req?.body?.variables?.body === '') {
                throw new Error('Post body must not be empty.');
            }

            const body = context.req.body.variables.body;

            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            });
            console.log(newPost, "newPost");
            const post = await newPost.save();
            console.log(post, "post");
/*
            context.pubsub.publish('NEW_POST', {
                newPost: post
            })
*/
            return post;
        },
        async deletePost(_, { postId }, context){
            const user = checkAuth(context);

            try{
                const post = await Post.findById(postId);
                // if post is created by user, allow user to delete post
                if(user.username === post.username){
                    await post.delete();
                    return 'Post deleted successfully.';
                } else {
                    throw new AuthenticationError('Action not allowed.');
                }
            } catch(err){
                throw new Error(err);
            }
        },
        async likePost(_, { postId }, context){
            const { username } = checkAuth(context);

            const post = await Post.findById(postId);

            if(post){
                if(post.likes.find(like => like.username === username)){
                    // If user has already liked post, unlike it
                    post.likes = post.likes.filter(like => like.username !== username);
                } else {
                    // If the post is not yet liked, like post
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString(),
                    })
                }
                
                await post.save();
                return post;
            }
        }
    },
    Subscription: {
        newPost: {
          subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
        }    
    }
};