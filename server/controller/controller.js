const express = require('express');
const Journal = require('../model/journalModel');
const Comment = require('../model/commentModel');
const router = express.Router();
const bodyParser = require ('body-parser');

router.get('/', (req,res) =>
{
    res.sendFile("../client/index.html", { root: '..'});
});

// returns all journals
router.get('/allJournals', (req,res) =>
{
    res.set('Content-Type', 'application/json');
    let theData = Journal.all;
    res.status(200);
    res.json(theData);
});

// return journal based on id
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

// returns all comments
router.get('/allComments', (req,res) =>
{
    res.set('Content-Type', 'application/json');
    let theCommentData = Comment.all;
    res.status(200);
    res.json(theCommentData);
});

// this posts a new journal
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Needs to be fixed, req/res not in use !!!!!!!!!!!!!!!!
router.post('/newJournal', (req,res) =>
{

    const data = req.body;
    console.log("data is: "+ data.content)

    try{
    //get the data for our new journal
    //TODO:  Replace with better stuff when we have front end.
    const testData = ({id: 99, content: data.content, reactions: '', giphy: '', comments: '' });

    //create journal obj
    const newJournal = Journal.create(testData);
    res.status(201).send(newJournal);
    //do something
    //console.log(`Created journal, ${newJournal.id}`);
    }catch (error){
        throw new Error ('Failed to create journal for reason: ' + error);
        res.status(400).send()
    }
});

// router.post('/newJournal', (req,res) =>
// {

//     const data = req.body;
//     console.log("data is: "+ data.content)

//   try {
//     const newJournal = Journal.create(data); //Creates a new instance of journal
    
//     res.status(201).send(newJournal);
//   } catch (e) {
//     res.status(400).send(`<h1>Failed to create journal for reason: ${e}</h1>`);
//   }
// });


router.delete('/journal/:id', (req, res)=> {
    const journalId = parseInt(req.params.id);
    const journalToDestroy = Journal.findById(journalId);
    journalToDestroy.destroy();
    res.status(204).send();
    
})


module.exports = router;

