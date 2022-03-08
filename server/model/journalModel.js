const journalData = require('../data/journalData.js');

class Journal {

    constructor(id, content, reactions, giphy, comments) {

        this.id = id;
        this.content= content;
        this.reactions = reactions;
        this.giphy = giphy;
        this.comments = comments;        
    }

    static get all(){
        return journalData;
    }

    static findById(id){
        try{
            const journalArr = journalData.filter((journals)=> journals.id ===id)[0];
            const journal = new Journal(journalArr.id, journalArr.content, journalArr.reactions, journalArr.giphy, journalArr.comments);
            return journal;
        } catch (error) {
            throw new Error("That journal post does not exist!");
        }        
    }

    static create(journals){

        let journalId = journalData.length +1; // creates the new journal's id
        console.log( "Adding journal with content: " +journals.content);
        let newJournal = new Journal(journalId, journals.content,journals.reactions, journals.giphy, journals.comments);
        
        console.log("New journal content: " +newJournal.content);

        journalData.push(newJournal);
        this.saveJournals();
        return newJournal;
    };

   static destroy(){
        const journal = journalData.filter((journal) => journal.id === this.id)[0];
        journalData.splice(journalData.indexOf(journal), 1);
    };


    //Call this method after making any change, i.e. create comment or update comment.  MAY want to use Async and await to stop processing other functions.
    static saveJournals()
    {
        //get the data we want to save
        const dataToSave = JSON.stringify(journalData);
    
        // use fs.writeFile, specify directory, what to save, and error handling.
        fs.writeFile('../server/data/journalJSONData.txt', dataToSave, err =>
            {
                if (err)
                {
                    console.log("Couldn't save journal data, reason: " + err);
                }
                else
                {
                    console.log("Journal data saved successfully.");
                }
            })
            
    }
}

module.exports = Journal;
