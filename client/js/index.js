// Create array of all input buttons of type submit wrapped in a form
const button = document.querySelectorAll("form input[type ='submit']");


// Add event listeners to each button in button array
button.forEach( function (thisButton)
{
    thisButton.addEventListener('click', buttonHandler);
});


//Takes clicks on buttons and handles them, calling appropriate functions depending on which button was clicked
function buttonHandler (submitEvent) 
{
    //prevent refresh
    submitEvent.preventDefault();

    //Get the id of the button that was clicked
    let choice = submitEvent.target.getAttribute("id");

    //If choice === testSubmitJournal submit the new journal
    if (choice === 'testSubmitJournal')
    {
        sumbitJournal();
    }
    // If choice === refreshJournals // call showAllJournals 
    else if (choice === 'refreshJournals')
    {
        showAllJournals();
    }
    //If choice is none of these // throw debug error alert
    else
    {
        alert("Don't know what clicked, target is: " +submitEvent.target.getAttribute("id"));
    }
}

//Gets content entered into contentInputBox, then posts the new journal
function sumbitJournal()
{
    //get text input into the box
    let contentInput = document.getElementById("contentInputBox").value;

    //POST the journal
    fetch("http://localhost:3000/newJournal", 
    {
        method: "POST",
        headers: { 'Content-Type' : 'application/Json'},
        body:   JSON.stringify({
            //details to send - id is irrelevant, our backend resolves.
            "id": 99,
            "content": contentInput,
            "reactions" : [0,0,0],
            "giphy": ""
        })
    })
    //Throw an error if it didn't work.
    .catch ((error) => alert ("Couldn't post, reason: " +error))
};


//Refreshes screen, displaying all Journals and comments
async function showAllJournals()
{
    //Create variables containing both sets of data, by calling functions which return journals and comments
    let journalData = await getJournals();
    let commentData = await getComments();

    //Loop through our journals
    journalData.forEach((jrnl) =>
    {
        //Creating P elements and adding them to the display section for the journal
        let paragraph = document.createElement("p");
        let paragraphContent = document.createTextNode(JSON.stringify(jrnl.content));
        paragraph.appendChild(paragraphContent);
        document.getElementById("displayJournalsSection").appendChild(paragraph );

        //Then loop through the comments
        commentData.forEach((cmt) =>
        {
            //and if the current comment.jounralId === journal.id, add it on beneath the current journal
            if (cmt.journalId === jrnl.id)
            {
                let cmtBlock = document.createElement("blockquote");
                let cmtContent = document.createTextNode(JSON.stringify(cmt.content));
                cmtBlock.appendChild(cmtContent)
                document.getElementById("displayJournalsSection").appendChild(cmtBlock);
            }
        });
    });
}


//Fetches all journals - MAKE SURE TO RUN FROM ASYNC function and use AWAIT keyword when calling
function getJournals ()
{
    //Return promise to originating function, get the journal data then return it 
    return fetch("http://localhost:3000/allJournals")
        .then( (resp) => resp.json())
        .then( (jData) => 
        {
            return jData;
        })
        .catch((error) => alert ("Couldn't get journals, reason: " +error));
}

//Fetches all comments - MAKE SURE TO RUN FROM ASYNC function and use AWAIT keyword when calling
function getComments ()
{
    //Return promise to originating function, get the comments data then return it 
    return fetch("http://localhost:3000/allComments")
        .then( (resp) => resp.json())
        .then( (cData) => 
        {
            return cData;
        })
        .catch((error) => alert ("Couldn't get comments, reason: " +error));
}

//Fetches all comments by journal id - takes a journal id.  - MAKE SURE TO RUN FROM ASYNC function and use AWAIT keyword when calling
function getCommentsByJournalID(jId)
{
    //Return promise to originating function, get the comments data then return it 
    return fetch("http://localhost:3000/byJournalId/"+jId)
        .then((resp) => resp.json())
        .then( (cdata) =>
        {
            return cdata;
        })
        .catch((error) => alert("Couldn't get comments, reason: " +error));
}





// ************* GIPHY CODE BELOW ************* //

let apikey = "plyhLse5MeEGhzbbKjkGgEHPwyOfS5Qh";

document.addEventListener("DOMContentLoaded", giftest)
// Also add a prevent emepty 
function giftest() {
    document.getElementById("btnsearch").addEventListener("click", ev => {
        ev.preventDefault();
        let url = `https://api.giphy.com/v1/gifs/search?api_key=${apikey}&limit=16&q=`;
        let str = document.getElementById("search").value.replace(/\s+/g, '')
        url = url.concat(str.trim());
        console.log(url)
        fetch(url)
        .then(response => response.json()) // json object
        .then(content => {
            console.log(content.data)
            console.log('META', content.meta)
            let figure = document.createElement('figure');
            let img = document.createElement('img');
            img.src = content.data[0].images.downsized.url;  // taken from META 
            img.alt = content.data[0].title
            figure.appendChild(img);
            let out = document.querySelector(".out")
            out.insertAdjacentElement('afterbegin', figure)
        })
        .catch(err =>{
            console.error(err) // should handler error
        })
    })
}