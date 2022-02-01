const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const { username } = checkAuth(context);
            // If comment is empty, throw error
            if(body.trim() == ''){
                throw new UserInputError('Empty Comment', {
                    errors: {
                        body: 'Comment field must not be empty'
                    }
                })
            }

            const post = await Post.findById(postId);

            if(post){
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })
                await post.save();
                return post;
            } else throw new UserInputError('Post not found');
        },
        // Delete Post 
        async deleteComment(_, { postId, commentId}, context){
            const { username } = checkAuth(context);

            const post = await Post.findById(postId);

            if(post){
                
                const commentIndex = post.comments.findIndex(c => c.id === commentId);
                // If user is the owner of the comment allow them to delete comment
                if(post.comments[commentIndex].username === username){
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                    return post;
                } else {
                    throw new AuthenticationError('Action not allowed')
                }
            } else {
                throw new UserInputError('Post not found');
            }
        }
    }
}