const { throws } = require('assert');
const fs = require('fs');
let journalData = require('../data/journalData.js');

class Journal {

    constructor(id, content, reactions = [0,0,0], giphy = "") {

        this.id = id;
        this.content= content;
        this.reactions = reactions;
        this.giphy = giphy;    
    }

    static get all(){
        this.loadJournals();
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
        this.loadJournals();

        let journalId = journalData.length +1; // creates the new journal's id
        console.log( "Adding journal with content: " +journals.content);
        let newJournal = new Journal(journalId, journals.content,journals.reactions, journals.giphy, journals.comments);
        
        console.log("New journal content: " +newJournal.content);

        journalData.push(newJournal);
        this.saveJournals();
        return newJournal;
    };

   static destroy(){
       this.loadJournals();

        const journal = journalData.filter((journal) => journal.id === this.id)[0];
        journalData.splice(journalData.indexOf(journal), 1);
    };


    //Call this method after making any change, i.e. create or update journals.  
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

    //Loads journals from file, sets journalData to equal the data loaded.  Call this before getting data to ensure up to date.
    static loadJournals()
    {
        //variable we'll use to store the loaded and parsed data
        let parsedData;

        //read data from file, location, format, error and data handling
        fs.readFile('../server/data/journalJSONData.txt', 'utf-8', (err, data) =>
        {
            //if we got error rather than data - log it
            if(err)
            {
                console.log("Couldn't load journal data for reason: " +err);
            }
            // if we got the data back, parse it and assign it to journalData
            else
            {
                parsedData = JSON.parse(data);
                journalData = parsedData;
            }
        })
    }


    static updateJournal(id,update)
    {

        journalData.forEach((jrnl) =>
        {
            if (jrnl.id === id)
            {
                jrnl.reactions = update;
                console.log("Updated journal : " +jrnl.id);
            }
        });

        this.saveJournals();
    }


}

module.exports = Journal;
