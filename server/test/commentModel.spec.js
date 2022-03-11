// import data
const commentData = require("../data/commentData");

// import model

const Comment = require("../model/commentModel");

describe("comment", () => {
    const testComment = {
      //The journal to be tested
      journalId: 3,
      content: "test content",
      reactions: [0,0,0],
      giphy: "",
    };


    // it fails but why? !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    it('it should make an instance of a comment', () => {
        const comment = new Comment({ id: 10000, ...testComment });

        expect(comment.id).toBe(10000);
        expect(comment.journalId).toBe(3);
        expect(comment.content).toBe("test content");
        expect(comment.reactions).toBe([0,0,0]);
        expect(comment.giphy).toBe("");
    });

    it('it should return all comments', () => {
        const comments = Comment.all;

        expect(comments).toEqual(commentData);
    });

    it('should return a comment', () => {
        const comment = Comment.findById(1);

        expect(comment).toEqual(commentData[0]);
    });

    it('should throw an error if there is no comment', () => {
        function testError() {
            Comment.findCommentById(10000000000000000000000);
        }
        expect(testError).toThrowError('That comment does not exist!');
    });

    it('should create a comment', () => {
        const newCommentId = commentData.length + 1;
        const newComment = Comment.create(testComment);

        expect(newComment).toEqual({ id: newCommentId, ...testComment });
    });

});    
