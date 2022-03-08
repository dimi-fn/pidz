showAllJournals();

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
    .then(showAllJournals())
    //Throw an error if it didn't work.
    .catch ((error) => alert ("Couldn't post, reason: " +error));
};


//Refreshes screen, displaying all Journals and comments
async function showAllJournals()
{
    //Clear what's on screen rn.
    document.getElementById("displayJournalsSection").innerHTML="";

    //Create variables containing both sets of data, by calling functions which return journals and comments
    let journalData = await getJournals();
    let commentData = await getComments();

    //Sort our journals and comments in descending order by id
    journalData.sort((a,b) => parseInt(b.id) - parseInt(a.id));
    commentData.sort((a,b) => parseInt(b.id) - parseInt(a.id));

    //Loop through our journals
    journalData.forEach((jrnl) =>
    {
        //Create new journal div, set it's id to current jrnl.id +div  ( i.e.  5div )
        let journalDiv = document.createElement("div");
        journalDiv.setAttribute("id",jrnl.id+"div");
        journalDiv.setAttribute("class","journal");

        //Create P element to display journal id
        let journalIDP = document.createElement("p");
        journalIDP.setAttribute("id",jrnl.id+ "idp");
        journalIDP.innerText = "Journal id:" + jrnl.id;


        //Create P element to display journal content
        let journalContentP = document.createElement("p");
        journalContentP.setAttribute("id",jrnl.id+"contentp");
        journalContentP.innerText = jrnl.content;
        
        //Create a P element to display giphy
        let journalGiphyP = document.createElement("p");
        journalGiphyP.setAttribute("id",jrnl.id+"giphyp");

        //create a P element to display reactions
        let journalReactionP = document.createElement("p");
        journalReactionP.setAttribute("id",jrnl.id+"reactionp");
        journalReactionP.innerHTML = jrnl.reactions;


        //Put them all together
        journalDiv.appendChild(journalIDP).appendChild(journalContentP).appendChild(journalGiphyP).appendChild(journalReactionP);

        //Add them to page
        document.getElementById("displayJournalsSection").appendChild(journalDiv);

        //Then loop through the comments
        commentData.forEach((cmt) =>
        {
            //and if the current comment.jounralId === journal.id, add it on beneath the current journal
            if (cmt.journalId === jrnl.id)
            {
                //create a new comment div
                let cmtDiv = document.createElement("div");
                cmtDiv.setAttribute("id",cmt.id+"div");
                cmtDiv.setAttribute("class","comment");

                //create a p to store comment id
                let cmtIdP = document.createElement("p");
                cmtIdP.setAttribute("id",cmt.id+"idp");
                cmtIdP.innerText = "Comment id: " +cmt.id;

                //create a p to store comment content
                let cmtContentP = document.createElement("p");
                cmtContentP.setAttribute("id",cmt.id+"contentp");
                cmtContentP.innerText = cmt.content;

                //create a p to store comment giphy
                let cmtGiphyP = document.createElement("p");
                cmtGiphyP.setAttribute("id",cmt.id+"giphyp");
                cmtGiphyP.innerHTML = cmt.giphy;

                //create a p to store comment reactions
                let cmtReactionP = document.createElement("p");
                cmtReactionP.setAttribute("id",cmt.id+"reactionp");
                cmtReactionP.innerHTML= cmt.reactions;



                //Add them all together
                cmtDiv.appendChild(cmtIdP).appendChild(cmtContentP).appendChild(cmtGiphyP).appendChild(cmtReactionP);

                //Add them onto our journal section below their respective journal.
                document.getElementById("displayJournalsSection").appendChild(cmtDiv);
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

function updateJournalReactions(jId,reaction)
{
    fetch("http://localhost:3000/journal/update/"+jId,
    {
    method: "PATCH",
    headers: { 'Content-Type' : 'application/Json'},
    body:   JSON.stringify({
        "id": jId,
        "reactions" : reaction
    })
    });
}

function updateCommentReactions(cId,reaction)
{
    fetch("http://localhost:3000/comment/update/"+cId,
    {
    method: "PATCH",
    headers: { 'Content-Type' : 'application/Json'},
    body:   JSON.stringify({
        "id": cId,
        "reactions" : reaction
    })
    });
}



// ************* GIPHY CODE BELOW ************* //

// add in a way to select multiple gifs

// add in a way to let the user to choose from multiple gifs 

let apikey = "plyhLse5MeEGhzbbKjkGgEHPwyOfS5Qh";
const NR_GIF = 4;

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
            for (let i = 0; i < NR_GIF; i++) {
                let figure = document.createElement('figure');
                let img = document.createElement('img');
                img.src = content.data[i].images.downsized.url;
                img.alt = content.data[i].title; 
                figure.appendChild(img);
                let out = document.querySelector("#image" + i)
                out.innerHTML="";
                out.insertAdjacentElement('afterbegin', figure)
            }

            picture_selection()
        })
        .catch(err =>{
            console.error(err) // should handler error
        })
    })
}

function picture_selection() {
    let first = document.getElementById("image0")
    let second = document.getElementById("image1")
    let third = document.getElementById("image2")
    let fourth = document.getElementById("image3")
    document.getElementById("image0").addEventListener('click', resp => {
        resp.preventDefault()
        second.innerHTML = "";
        third.innerHTML = "";
        fourth.innerHTML = "";
    })
    document.getElementById("image1").addEventListener('click', resp => {
        resp.preventDefault() 
        first.innerHTML = "";
        third.innerHTML = "";
        fourth.innerHTML = "";
    })
    document.getElementById("image2").addEventListener('click', resp => {
        resp.preventDefault()
        first.innerHTML = "";
        second.innerHTML = "";
        fourth.innerHTML = "";
    })
    document.getElementById("image3").addEventListener('click', resp => {
        resp.preventDefault()
        first.innerHTML = "";
        second.innerHTML = "";
        third.innerHTML = "";
    })
}
