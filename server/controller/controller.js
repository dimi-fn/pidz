const express = require('express');
const Journal = require('../model/journalModel');
const Comment = require('../model/commentModel');
const router = express.Router();
const bodyParser = require ('body-parser');
const { send } = require('process');

router.get('/', (req,res) =>
{
    res.sendFile("../client/index.html", { root: '..'});
});


/***************************** Journals **********************************************/
// returns all journals
router.get('/allJournals', (req,res) =>
{
    res.set('Content-Type', 'application/json');
    let theData = Journal.all;
    res.status(200);
    res.json(theData);
});

// return journal based on journal's id
router.get('/journal/:id', (req,res)=> {
    try {
        const journalId = parseInt(req.params.id);
        const selectedJournalId = Journal.findById(journalId);
        res.send(selectedJournalId);
    } catch (error) {
        console.log(error);
        res.status(404).send(error); 
    }
});

// this posts a new journal
// !!!!!!!!! Needs to be fixed, req/res not in use ?
router.post('/newJournal', (req,res) =>
{
    const data = req.body;

    try{
    //get the data for our new journal
    //TODO:  Replace with better stuff when we have front end.
    const testData = ({id: '', content: data.content, reactions: [0,0,0], giphy: data.giphy });

    //create journal obj
    const newJournal = Journal.create(testData);
    res.status(201).send(newJournal);

    }catch (error){
        throw new Error ('Failed to create journal for reason: ' + error);
        res.status(400).send()
    }
});

//Update a journal with new reaction array update 
router.patch('/journal/update/:id', (req,res) =>
{
    //get the id we're updating
    const journalId= parseInt(req.params.id);
    //get the reaction data from body to update
    const updateData = req.body.reactions;

    try
    {
        //call journal update function, pass journalid and the data (reactions)
        Journal.updateJournal(journalId, updateData);
        res.status(200);
    }
    catch (err)
    {
        console.log("Failed to update at controller, error: " +err);
    }

});

// no need since no log-in system
// // Delete journal based on id
// router.delete('/journal/:id', (req, res)=> {
//     const journalId = parseInt(req.params.id);
//     const journalToDestroy = Journal.findById(journalId);
//     journalToDestroy.destroy();
//     res.status(204).send();
    
// })

/***************************** Comments **********************************************/
// returns all comments (array of objects)
router.get('/allComments', (req,res) =>
{
    res.set('Content-Type', 'application/json');
    let theCommentData = Comment.all;
    res.status(200);
    res.json(theCommentData);
});


// returns object of comment based on comment's id
router.get('/comment/:id', (req,res)=> {
    try {
        const commentId = parseInt(req.params.id);
        const selectedCommentlId = Comment.findCommentById(commentId);
        res.send(selectedCommentlId);
    } catch (error) {
        console.log(error);
        res.status(404).send(error); 
    }
});

// returns array of object(s) of comment(s) based on journal's id
// journalId - comments --> relationship one-to-many
router.get('/comments/journal/:id', (req,res)=> {
    try {
        const commentId = parseInt(req.params.id);
        const selectedCommentlId = Comment.findCommentsByJournalId(commentId);
        res.send(selectedCommentlId);
    } catch (error) {
        console.log(error);
        res.status(404).send(error); 
    }
});

router.post('/newComment', (req,res) =>
{
    const data = req.body;
    try{
    //get the data for our new comment
    const testData = ({id: '', journalId: data.journalId, content: data.content, reactions: [0,0,0], giphy: data.giphy});

    //create journal obj
    const newComment = Comment.create(testData);
    res.status(201).send(newComment);

    }catch (error){
        throw new Error ('Failed to create comment for reason: ' + error);
        res.status(400).send()
    }
});

//Update a comment with new reaction array update 
router.patch('/comment/update/:id', (req,res) =>
{
    const commentId= parseInt(req.params.id);
    const updateData = req.body.reactions;

    try
    {
        Comment.updateComment(commentId, updateData);
        res.status(200);
    }
    catch (err)
    {
        console.log("Failed to update at controller, error: " +err);
    }

});

module.exports = router;
