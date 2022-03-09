const request = require('supertest');

//import server
const server = require('../server');

describe("API server", () => {
    let api;
    let testJournal = {
      content: "a random post",
      reactions: [0,0,0],              
      giphy: ""            
      // comments: "this is a great post!",
    };
  
    beforeAll(() => {
      // start the server and store it in the api variable
      api = server.listen(5000, () =>
        console.log("Test server running on port 5000")
      );
    });
  
    afterAll((done) => {
      // close the server, then run done
      console.log("Gracefully stopping test server");
      api.close(done);
    });

    it("responds to get / with status 200", (done) => {
        request(api).get("/").expect(200, done);
      });
  
    it("responds to get / with status 200", (done) => {
      request(api).get("/allJournals").expect(200, done);
    });

    /* Needs fixing !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    - how should id be defined since it is auto-incremented by 1 every time the test runs?

    it('responds to post /newJournal with status 201', (done) => {
      request(api)
          .post('/newJournal')
          .send(testJournal)
          .set('Accept', /application\/json/)
          .expect(201)
          .expect({ id: 4, ...testJournal }, done);
  });

  */

    it('retrieves a journal by journal id', (done) => {
      request(api)
          .get('/journal/2')
          .expect(200)
          .expect({ id: 2, content: "Test 2", reactions: [3,5,2], giphy: "" }, done);
  });


    it('responds to an unknown journal id with a 404', (done) => {
      request(api).get('/journal/100000000000').expect(404).expect({}, done);
    });

    it('responds to non existing paths with 404', (done) => {
      request(api).get('/no').expect(404, done);
  });

    it('responds to invalid method request with 404', (done) => {
      request(api).post('/').expect(404, done);
  });

});
   