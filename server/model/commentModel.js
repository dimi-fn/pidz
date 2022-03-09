const { throws } = require('assert');
const fs = require('fs');
let commentData = require('../data/commentData.js');

class Comment {

    constructor(id, journalId, content, reactions, giphy) {

        this.id = id;
        this.journalId= journalId;
        this.content = content;
        this.reactions = reactions;
        this.giphy = giphy; 
    }

    static get all(){
        this.loadComments();
        return commentData;
    }

    // finds comment based on id 
    static findCommentById(id){
        this.loadComments();
        try{
            const commentArr = commentData.filter((comments)=> comments.id ===id)[0];
            const comment = new Comment (commentArr.id, commentArr.journalId, commentArr.content, commentArr.reactions, commentArr.giphy);
            return comment;
        } catch (error) {
            throw new Error("That comment does not exist!");
        }        
    }

     // finds comment(s) based on journalId | (one journalId might appear in many commentIds, i.e. relationship 1-to-many)
     static findCommentsByJournalId(journalId){
        this.loadComments();
        try{
            const commentsOfJournalId = commentData.filter(comments => comments.journalId == journalId);
            let arrayOfComments = [];
            for (let obj of commentsOfJournalId){
                arrayOfComments.push(obj)
            }
            return arrayOfComments;
        } catch (error) {
            throw new Error("That journal id doesn't have any comments!");
        }        
    }

    // creates new comment
    static create(comments){
        this.loadComments();
        let commentId = commentData.length + 1; // creates the new comment's id
        console.log(`Adding comment with content: ${comments.content}`);
        let newComment = new Comment(commentId, comments.journalId, comments.content, comments.reactions, comments.giphy);

        console.log(`New comment: ${comments.content} regading the journal with id: ${comments.journalId}`);
        commentData.push(newComment);
        this.saveComments();
        return newComment;
    }


    //Call this method after making any change, i.e. create comment or update comment. 
    static saveComments()
    {
        //get the data we want to save
        const dataToSave = JSON.stringify(commentData);

        //use fs.writeFile, specify location to save, what to save, and error handling.
        fs.writeFile('../server/data/commentJSONData.txt', dataToSave, err =>
        {
            if (err)
            {
                console.log("Couldn't save comment data, reason: " + err);
            }
            else
            {
                console.log("Successfully saved comment data.");
            }
        })
        
    }

    // Call this before loading any data to ensure up to date with comments
    static loadComments()
    {

        //variable we'll use to store the loaded and parsed data
        let parsedData;

        //read data from file, location, format, error and data handling
        fs.readFile('../server/data/commentJSONData.txt', 'utf-8', (err, data) =>
        {
            //if we got error rather than data - log it
            if(err)
            {
                console.log("Couldn't load comment data for reason: " +err);
            }
            // if we got the data back, parse it and assign it to commentData
            else
            {
                parsedData = JSON.parse(data);
                commentData = parsedData;
            }
        });
    }

    
    static updateComment(id,update)
    {

        CommentData.forEach((cmt) =>
        {
            if (cmt.id === id)
            {
                cmt.reactions = update;
                console.log("Updated comment : " +cmt.id);
            }
        });

        this.saveComments();
    }



}

module.exports = Comment;
