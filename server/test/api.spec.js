const request = require('supertest');

//import server
const server = require('..server');

describe("API server", () => {
    let api;
    let testJournal = {
      content: "a random post",
      reactions: "",             /*needs to be fixed?!!!!!!!!! --> emoji*/ 
      giphy: "",                 /*needs to be fixed?!!!!!!!!!*/
      comments: "oh, this is a great post!",
    };
  
    beforeAll(() => {
      // start the server and store it in the api variable
      api = server.listen(5000, () =>
        console.log("Test server running on port 5000")
      );
    });
  
    afterAll((done) => {
      // close the server, then run done
      console.log("Stopping test server...");
      api.close(done);
    });

    it("responds to get / with status 200", (done) => {
        request(api).get("/").expect(200, done);
      });
  
    it("responds to get / with status 200", (done) => {
      request(api).get("/allJournals").expect(200, done);
    });
  

    it("responds to post /journals with status 201", (done) => {
      request(api)
        .post("/newJournal")
        .send(testJournal)
        .set("Accept", /application\/json/)
        .expect(201)
        .expect({ id: 10, ...testJournal }, done);
    });
  
    it("retrieves a journal by id", (done) => {
      request(api)
        .get("/3")
        .expect(200)
        .expect({ id: 3, content: "some other random post", reactions: "", giphy: "", comments: "another comment!" }, done);
    });
  
    it("responds to an unknown journal id with a 404", (done) => {
      request(api).get("/100000").expect(404).expect({}, done);
    });

    // maybe it fails because we have a dynamic class of journals
    it("responds to delete /journal/:id with status 204", async () => {
      await request(api).delete("/journal/4").expect(204);
  
      const updatedJournals = await request(api).get("/allJournals");
  
      expect(updatedJournals.body.length).toBe(3);
    });
    
    it("responds to non existing paths with 404", (done) => {
      request(api).get("/no").expect(404, done);
    });

    it('responds to invalid method request with 405', (done) => {
        request(api).post('/').expect(405, done);
    });
  });
