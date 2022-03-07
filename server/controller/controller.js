const express = require ('express');
const Journal = require('../model/journalModel');
const router = express.Router();

router.get('/', (req,resp) =>
{
    resp.sendFile("/client/index.html", { root: '..'});
});

router.get('/allJournals', (req,resp) =>
{
    resp.set('Content-Type', 'application/json');
    let theData = Journal.all;
    resp.status(200);
    resp.json(theData);
});

// to be reviewed if it's ok! ************************
router.get('/:id', (req,res)=> {
    try {
        const journalId = parseInt(req.params.id);
        const selectedJournalId = Journal.findById(journalId);
        res.send(selectedJournalId);
    } catch (error) {
        console.log(error);
        res.status(404).send(error); 
    }
});

router.post('/newJournal', (req,resp) =>
{
    try{
    //get the data for our new journal
    //TODO:  Replace with better stuff when we have front end.
    const testData = ({id: 99, content: 'TestCreate', reactions: '', giphy: '', comments: '' })
    //create journal obj
    const newJournal = Journal.create(testData);
    //do something
    console.log(`Created journal, ${newJournal.id}`);
    }catch (error){
        throw new Error ('Failed to create journal for reason: ' + error);
    }
});

module.exports = router;