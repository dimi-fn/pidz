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

// add in a way to select multiple gifs

// add in a way to let the user to choose from multiple gifs 

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
            let s_figure = document.createElement('figure')
            let t_figure = document.createElement('figure')
            let f_figure = document.createElement('figure')
            let img = document.createElement('img');
            let s_img = document.createElement('img')
            let t_img = document.createElement('img')
            let f_img = document.createElement('img')
            img.src = content.data[0].images.downsized.url;
            s_img.src = content.data[1].images.downsized.url;
            t_img.src = content.data[2].images.downsized.url;
            f_img.src = content.data[3].images.downsized.url;
            img.alt = content.data[1].title // taken from META 
            img.alt = content.data[0].title
            figure.appendChild(img);
            s_figure.appendChild(s_img)
            t_figure.appendChild(t_img)
            f_figure.appendChild(f_img)
            let out = document.querySelector("#first_image")
            out.insertAdjacentElement('afterbegin', figure)
            let second_image = document.querySelector("#second_image")
            second_image.insertAdjacentElement('afterbegin',s_figure)
            let third_image = document.querySelector("#third_image")
            third_image.insertAdjacentElement('afterbegin', t_figure)
            let fourth_image = document.querySelector("#fourth_image")
            fourth_image.insertAdjacentElement('afterbegin',f_figure)
            picture_selection()
            
        })
        .catch(err =>{
            console.error(err) // should handler error
        })
    })
}

function picture_selection() {
    let first = document.getElementById("first_image")
    let second = document.getElementById("second_image")
    let third = document.getElementById("third_image")
    let fourth = document.getElementById("fourth_image")
    document.getElementById("first_image").addEventListener('click', resp => {
        resp.preventDefault()
        second.remove()
        third.remove()
        fourth.remove()
    })
    document.getElementById("second_image").addEventListener('click', resp => {
        resp.preventDefault()
        first.remove()
        third.remove()
        fourth.remove()
    })
    document.getElementById("third_image").addEventListener('click', resp => {
        resp.preventDefault()
        first.remove()
        second.remove()
        fourth.remove()
    })
    document.getElementById("fourth_image").addEventListener('click', resp => {
        resp.preventDefault()
        first.remove()
        third.remove()
        second.remove()
    })
}