showAllJournals();
addEventHandlers();

function addEventHandlers()
{
    // Create array of all input buttons of type submit wrapped in a form
    const button = document.querySelectorAll("form input[type ='submit']");


    // Add event listeners to each button in button array
    button.forEach( function (thisButton)
    {
        thisButton.addEventListener('click', buttonHandler);
    });
}

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
    // if choice === commentGiphyBtn // start add giphy process
    else if(choice === 'commentGiphyBtn')
    {

        let targetName = submitEvent.target.name;  
        let journalId = ""+targetName;
        journalId = journalId.replace("commentGiphyBtn","");

        try
        {
            let searchBar = document.getElementById(journalId+"cmtGiphySearch");
            let searchTerm = searchBar.value;

            if(searchTerm === "" || !searchTerm)
            {
                alert("Invalid search term - did you add anything in?");
            }
            else
            {
                addGiphytoComment(journalId,searchTerm);
            }
        }
        catch
        {
            alert("Couldn't get giphy search bar input");
        }
    }
    // if choice === submitJournalComment // Call addCommentToJournal
    else if(choice === 'submitJournalComment')
    {
        let targetJournal = submitEvent.target.name;
        console.log("Taget Journal: " + targetJournal)
        addCommentToJournal(targetJournal);
    }
    else if(choice === 'giphybtnsearch')
    {
        let searchBar = document.getElementById("giphytextsearch");
        let searchTerm = searchBar.value;

        if(searchTerm === "" || !searchTerm)
        {
            alert("Invalid search term - did you add anything in the search box?");
        }
        else
        {
            addGiphyToNewJournal(searchTerm);
        }
    }
    //If choice is none of these // throw debug error alert
    else
    {
        alert("Don't know what clicked, target is: " +submitEvent.target.getAttribute("id"));
    }
}


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
        let journalGiphyP = document.createElement("div");
        journalGiphyP.setAttribute("id",jrnl.id+"giphyp");
        journalGiphyP.innerHTML = `<img src = ${jrnl.giphy}>`

        //create a P element to display reactions
        let journalReactionP = document.createElement("p");
        journalReactionP.setAttribute("id",jrnl.id+"reactionp");
        journalReactionP.innerHTML = jrnl.reactions;


        //create div for adding comments
        let journalCommentInputDiv = document.createElement("div");
        journalCommentInputDiv.setAttribute("id",jrnl.id+"cmtdiv");
        journalCommentInputDiv.setAttribute("class","cmtInputDiv");

        //create form for adding comments
        let journalCommentForm = document.createElement("form");
        journalCommentForm.setAttribute("id",jrnl.id+"cmtform");


        //Create text input box for adding comments
        let journalCommentInput = document.createElement("input");
        journalCommentInput.setAttribute("id", jrnl.id+"cmtInput");
        journalCommentInput.type = "text";

        //create button to submit comment
        let journalCommentInputSubmit = document.createElement("input");
        journalCommentInputSubmit.setAttribute("id","submitJournalComment");
        journalCommentInputSubmit.type = "submit";
        journalCommentInputSubmit.value = "Submit Comment";
        journalCommentInputSubmit.name = jrnl.id;

        //create giphy search bar for adding giphy to comment
        let journalCommentGiphySearch = document.createElement("input");
        journalCommentGiphySearch.setAttribute("id",jrnl.id+"cmtGiphySearch")
        journalCommentGiphySearch.type = "text";

        //create giphy button for adding giphy to comment
        let journalCommentGiphyBtn = document.createElement("input");
        journalCommentGiphyBtn.type = "submit";
        journalCommentGiphyBtn.setAttribute("id","commentGiphyBtn");
        journalCommentGiphyBtn.value = "Select Giphy";
        journalCommentGiphyBtn.name = jrnl.id+"commentGiphyBtn";

        //create giphy preview div
        let journalCommentGiphyPreview = document.createElement("div");
        journalCommentGiphyPreview.setAttribute("id",jrnl.id+"cmtGiphyPreview");
        journalCommentGiphyPreview.classList.add("cmtGiphyPreview");

        //Put the comment input form together
        journalCommentForm.appendChild(journalCommentInput);
        journalCommentForm.appendChild(journalCommentGiphySearch);
        journalCommentForm.appendChild(journalCommentGiphyBtn);
        journalCommentForm.appendChild(journalCommentGiphyPreview);
        journalCommentForm.appendChild(journalCommentInputSubmit);


        //Put them all together
        journalDiv.appendChild(journalIDP);
        journalDiv.appendChild(journalContentP);
        journalDiv.appendChild(journalGiphyP);
        journalDiv.appendChild(journalReactionP);
        journalDiv.appendChild(journalCommentInputDiv);
        journalDiv.appendChild(journalCommentForm);

        //Add them to page
        document.getElementById("displayJournalsSection").appendChild(journalDiv);     

        //Then loop through the comments
        commentData.forEach((cmt) =>
        {  
            //and if the current comment.jounralId === journal.id, add it on beneath the current journal
            if (parseInt(cmt.journalId) === parseInt(jrnl.id))
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
                cmtGiphyP.innerHTML = `<img src = ${cmt.giphy}>`

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

        addEventHandlers();
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

//Gets content entered into contentInputBox, then posts the new journal
function sumbitJournal()
{
    //get text input into the box
    let contentInput = document.getElementById("contentInputBox").value;
    let giphyUrl = "";

    if(contentInput.length > 349)
    {
        alert("Too many characters for new journal - max is 350.")
    }
    else if(contentInput === "" || !contentInput)
    {
        alert("Invalid input for new journal - is the input box empty?")
    }
    else
    {
        try{
            giphyUrl = document.getElementById("jrnlGiphyImage").src;
        }
        catch (err)
        {
            console.log("giphy url blank - may be error: " +err)
        }
    
        //POST the journal
        fetch("http://localhost:3000/newJournal", 
        {
            method: "POST",
            headers: { 'Content-Type' : 'application/Json'},
            body:   JSON.stringify({
                //details to send - id is irrelevant, our backend resolves.
                "id": 99999,
                "content": contentInput,
                "reactions" : [0,0,0],
                "giphy": giphyUrl
            })
        })
        .then(showAllJournals())
        //Throw an error if it didn't work.
        .catch ((error) => alert ("Couldn't post, reason: " +error));

    }  
    
};

function addCommentToJournal(jrnlid)
{
    console.log("Getting input for "+ jrnlid+"cmtInput");
    // get comment input element relating to the journal
    let commentInput = document.getElementById(jrnlid+"cmtInput");
    // get the input text
    let inputContent = ""+commentInput.value;
    //Get the giphyUrl
    let giphyUrl = "";
    try{
        giphyUrl = document.getElementById("cmtGiphyImage").src;
    }
    catch (err)
    {
        console.log("giphy url blank - may be error: " +err)
    }
    

    //If characters greater than 350 (0 counts).. reject
    if(inputContent.length > 349)
    {
        alert("Maximum character length is 350.  Please shorten your comment");
    }
    //If input box is empty... reject
    else if (inputContent.length === 0)
    {
        alert("No comment input.  Please input a comment.");
    }
    // Else post comment
    else
    {

         //POST the Comment
        fetch("http://localhost:3000/newComment", 
        {
            method: "POST",
            headers: { 'Content-Type' : 'application/Json'},
            body:   JSON.stringify({
            //details to send - id is irrelevant, our backend resolves.
                "id" : 99999,
                "content" : inputContent,
                "reactions" : [0,0,0],
                "journalId" : jrnlid,
                "giphy" : giphyUrl
            })
        })
        .then(showAllJournals())
        .catch((error) => alert ("Couldn't post comment, reason: " + error));
    };


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



function addGiphytoComment(journalId, searchTerm)
{
    let url = `https://api.giphy.com/v1/gifs/search?api_key=${apikey}&limit=16&q=`;
    let targetDiv = document.getElementById(journalId+"cmtGiphyPreview");
    targetDiv.innerHTML = "";

    str= searchTerm.replace(" ", "")
    url = url.concat(str.trim())
    fetch(url)
    .then(response => response.json())
    .then( content => {
 
        if(document.getElementById("cimg0"))
        {
            alert("already selecting a giphy - commenting on a different journal?")
        }
        else
        {

            for( let i = 0; i < NR_GIF; i++)
            {

                targetDiv.innerHTML = targetDiv.innerHTML + ` <img id=img${i} src = "${content.data[i].images.downsized.url}" width=22.5% > ` ;
            }

            addGiphySelectPictureComment(content,targetDiv);
        }   
    })
}


function addGiphySelectPictureComment(content, targetDiv)
{
        document.getElementById("cImg0").addEventListener('click', resp => {
            targetDiv.innerHTML =  ` <img id=cmtGiphyImage src = "${content.data[0].images.downsized.url}" width=22.5% > ` ;
            
        })
        document.getElementById("cImg1").addEventListener('click', resp => {
            targetDiv.innerHTML =  ` <img id=cmtGiphyImage src = "${content.data[1].images.downsized.url}" width=22.5% > ` ;
            
        })
        document.getElementById("cImg2").addEventListener('click', resp => {
            targetDiv.innerHTML =  ` <img id=cmtGiphyImage src = "${content.data[2].images.downsized.url}" width=22.5% > ` ;
            
        })
        document.getElementById("cImg3").addEventListener('click', resp => {
            targetDiv.innerHTML =  ` <img id=cmtGiphyImage src = "${content.data[3].images.downsized.url}" width=22.5% > ` ;
            
        })
}


function addGiphyToNewJournal (searchTerm)
{

    let url = `https://api.giphy.com/v1/gifs/search?api_key=${apikey}&limit=16&q=`;
    let targetDiv = document.getElementById("newJournalGiphyPreview");
    targetDiv.innerHTML = "";
    
    str= searchTerm.replace(" ", "")
    url = url.concat(str.trim())
    fetch(url)
    .then(response => response.json())
    .then( content => {
 
        for( let i = 0; i < NR_GIF; i++)
        {
            targetDiv.innerHTML = targetDiv.innerHTML + ` <img id=jrnlImg${i} src = "${content.data[i].images.downsized.url}" width=22.5% > ` ;
        }

        let type = "journal";
        addGiphySelectPictureJournal(content,targetDiv);
    })

}

function addGiphySelectPictureJournal(content, targetDiv)
{

    document.getElementById("jImg0").addEventListener('click', resp => {
        targetDiv.innerHTML =  ` <img id=jrnlGiphyImage src = "${content.data[0].images.downsized.url}" width=22.5% > ` ;
        
    })
    document.getElementById("jImg1").addEventListener('click', resp => {
        targetDiv.innerHTML =  ` <img id=jrnlGiphyImage src = "${content.data[1].images.downsized.url}" width=22.5% > ` ;
        
    })
    document.getElementById("jImg2").addEventListener('click', resp => {
        targetDiv.innerHTML =  ` <img id=jrnlGiphyImage src = "${content.data[2].images.downsized.url}" width=22.5% > ` ;
        
    })
    document.getElementById("jImg3").addEventListener('click', resp => {
        targetDiv.innerHTML =  ` <img id=jrnlGiphyImage src = "${content.data[3].images.downsized.url}" width=22.5% > ` ;
        
    })
}






// ************* GIPHY CODE BELOW ************* //

// add in a way to select multiple gifs

// add in a way to let the user to choose from multiple gifs 

let apikey = "plyhLse5MeEGhzbbKjkGgEHPwyOfS5Qh";
const NR_GIF = 4;

// document.addEventListener("DOMContentLoaded", giftest)
// // Also add a prevent emepty 
// function giftest() {
//     document.getElementById("giphybtnsearch").addEventListener("click", ev => {
//         ev.preventDefault();
//         let url = `https://api.giphy.com/v1/gifs/search?api_key=${apikey}&limit=16&q=`;
//         let str = document.getElementById("giphytextsearch").value.replace(/\s+/g, '')
//         url = url.concat(str.trim());
//         console.log(url)
//         fetch(url)
//         .then(response => response.json()) // json object
//         .then(content => {
//             console.log(content.data)
//             console.log('META', content.meta)

//             for (let i = 0; i < NR_GIF; i++) {
//                 let figure = document.createElement('figure');
//                 let img = document.createElement('img');
//                 img.src = content.data[i].images.downsized.url;
//                 img.alt = content.data[i].title; 
//                 figure.appendChild(img);
//                 let out = document.querySelector("#image" + i)
//                 out.innerHTML="";
//                 out.insertAdjacentElement('afterbegin', figure)
//             }

//             picture_selection()
//         })
//         .catch(err =>{
//             console.error(err) // should handler error
//         })
//     })
// }

// function picture_selection() {
//     let first = document.getElementById("image0")
//     let second = document.getElementById("image1")
//     let third = document.getElementById("image2")
//     let fourth = document.getElementById("image3")
//     document.getElementById("image0").addEventListener('click', resp => {
//         resp.preventDefault()
//         second.innerHTML = "";
//         third.innerHTML = "";
//         fourth.innerHTML = "";
//     })
//     document.getElementById("image1").addEventListener('click', resp => {
//         resp.preventDefault() 
//         first.innerHTML = "";
//         third.innerHTML = "";
//         fourth.innerHTML = "";
//     })
//     document.getElementById("image2").addEventListener('click', resp => {
//         resp.preventDefault()
//         first.innerHTML = "";
//         second.innerHTML = "";
//         fourth.innerHTML = "";
//     })
//     document.getElementById("image3").addEventListener('click', resp => {
//         resp.preventDefault()
//         first.innerHTML = "";
//         second.innerHTML = "";
//         third.innerHTML = "";
//     })
// }
