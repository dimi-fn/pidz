// import data
const journalData = require("../data/journalData");

// import model

const Journal = require("../model/journalModel");

describe("journal post", () => {
    const testJournal = {
      //The journal to be tested
      content: "test content",
      reactions: [0,0,0],
      giphy: "",
      comments: "test comment"
    };

    // it fails but why? !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    it('it should make an instance of a journal', () => {
        const journal = new Journal({ id: 10000, ...testJournal });

        expect(journal.id).toBe(10000);
        expect(journal.content).toBe('test content');
        expect(journal.reactions).toBe([0,0,0]);
        expect(journal.giphy).toBe("");
        expect(journal.comments).toBe("test comment");
    });

    
    it('it should return all journals', () => {
        const journals = Journal.all;

        expect(journals).toEqual(journalData);
    });

    it('should return a journal', () => {
        const journal = Journal.findById(1);

        expect(journal).toEqual(journalData[0]);
    });

    it('should throw an error if there is no journal', () => {
        function testError() {
            Journal.findById(10000000000000000000000);
        }
        expect(testError).toThrowError('That journal post does not exist!');
    });

    it('should create a journal', () => {
        const newJournalId = journalData.length + 1;
        const newJournal = Journal.create(testJournal);

        expect(newJournal).toEqual({ id: newJournalId, ...testJournal });
    });

});    
