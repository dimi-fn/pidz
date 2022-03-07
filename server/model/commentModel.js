const commentData = require('../data/commentData.js');

class Comment {

    constructor(id, journalId, content, reactions, giphy) {

        this.id = id;
        this.journalId= journalId;
        this.content = content;
        this.reactions = reactions;c     
        this.giphy = giphy; 
    }

    static get all(){
        return commentData;
    }

    static findById(id){
        try{
            const commentArr = commentData.filter((comments)=> comments.id ===id)[0];
            const comment = new Comment (commentArr.id, commentArr.journalId, journalArr.content, commentArr.reactions, commentArr.giphy);
            return comment;
        } catch (error) {
            throw new Error("That comment does not exist!");
        }        
    }

    // creates new comment
    static create(comments){

        const commentId = comments.length + 1;
        let newComment = new Comment({id: commentId, ...comments});
    
        commentData.push(newComment);
        return newComment;
    }
}

module.exports = Comment;
