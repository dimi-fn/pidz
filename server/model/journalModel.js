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

        const journalId = journals.length + 1;
        let newJournal = new Journal({id: journalId, ...journals});
    
        journalData.push(newJournal);
        return newJournal;
    }

    destroy(){
        const journal = journalData.filter((journal) => journal.id === this.id)[0];
        journalData.splice(journalData.indexOf(journal), 1);
    }
}

module.exports = Journal;
