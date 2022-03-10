//*********** GLOBAL VARIABLES  ************/

//giphy apikey and nr gifs to let user choose from
let apikey = "plyhLse5MeEGhzbbKjkGgEHPwyOfS5Qh";
const NR_GIF = 4;

//number comments to show under each journal on frontpage - DONT CHANGE THIS TO LESS THAN 3.  IT BREAKS.  IDK WHY
const NR_CMTS = 4;

//PAGINATION Global variables -- PAGINATION CODE AT BOTTOM OF INDEX.JS
let current_page = 1
let journalsPerPage = 5


//ON PAGE LOAD
refreshPage();
addEventHandlers();


//PROCEDURALLY GENERATED EVENT HANDLING CODE
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

//*************** PATHING CODE FOR PROCEDURALLY GENERATED EVENT HANDLERS ***********//

//Takes clicks on buttons and handles them, calling appropriate functions depending on which button was clicked
function buttonHandler (submitEvent) 
{
    //prevent refresh
    submitEvent.preventDefault();

    //Get the id of the button that was clicked
    let choice = submitEvent.target.getAttribute("id");

    //If choice === SubmitJournal submit the new journal
    if (choice === 'submitJournal')
    {
        sumbitJournal();
    }
    // If choice === refreshJournals // call showAllJournals 
    else if (choice === 'refreshFrontPage')
    {
        changePage(1);
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

//**************** DISPLAY CODE ***********************************/

//Gets all data and then calls display data to show all on front page on first load
async function refreshPage ()
{
        current_page = 1;
        //Create variables containing both sets of data, by calling functions which return journals and comments
        let journalData = await getJournals();
        let commentData = await getComments();
        //We're doing a general refresh, so no targetting.
        let journaTargetted = false;

        displayData(journalData, commentData, journaTargetted);        
}

async function changePage(page)
{
    //Create variables containing both sets of data, by calling functions which return journals and comments
    let journalData = await getJournals();
    let commentData = await getComments();
    //We're switching pages, so no targetting.
    let journalTargetted = false;

    //create our array to send back
    let returnData = [];

    //get the elements
    let btn_next = document.getElementById("btn_next");
    let btn_prev = document.getElementById("btn_prev");
    let page_span = document.getElementById("page_span");

    

    //error handling
    if (page < 1) page = 1;
    if (page >numPages()) page = numPages();

    //hiding/appearing buttons
    if (page === 1) {
        btn_prev.classList.add("hidden");
        btn_prev.classList.remove("visible");
    } else {
        btn_prev.classList.add("visible");
        btn_prev.classList.remove("hidden")
    }

    if (page === numPages()) {
        btn_next.classList.add("hidden");
        btn_prev.classList.remove("visible");
    } else {
        btn_next.classList.add("visible");
        btn_next.classList.remove("hidden");
    }

    journalData.sort((a,b) => parseInt(b.id) - parseInt(a.id));

    //Get data to send
    for (var i = (page-1) * journalsPerPage; i < (page * journalsPerPage) && i < journalData.length; i++)
    
    {
        returnData.push(journalData[i]);
    }

    returnData.sort((a,b) => parseInt(b.id) - parseInt(a.id));

    page_span.innerHTML="Page: " + current_page + " / " + await numPages(); 

    displayData(returnData, commentData, journalTargetted)

}


//gets a single journal and then calls display data to show it and all comments on front page
async function displayTargetJournal(targetJournalId)
{
    //get all data
    let journalData = await getJournals();
    let commentData = await getComments();
    let journalTargetted = true;
    
    //variables for our data to pass
    let journalToPass = [];
    let commentsToPass = [];

    //loop through our journals, get the one we want and save it as our data to pass
    journalData.forEach((jrnl) =>
    {
        if(parseInt(jrnl.id) === parseInt(targetJournalId))
        {
            journalToPass.push(jrnl);
        };
    });

    //loop through comments, get the one we want and save it as our data to pass
    commentData.forEach((cmt) =>
    {
        if(parseInt(cmt.journalId) === parseInt(targetJournalId))
        {
            commentsToPass.push(cmt);
        };
    });

    //Send them to display
    displayData(journalToPass,commentsToPass, journalTargetted);
}

//Refreshes screen, displaying all Journals and comments
async function displayData(journalData, commentData, journalTargetted)
{
    //Clear what's on screen rn.
    document.getElementById("displayJournalsSection").innerHTML="";
    //IF anything is in input boxes, yeet it
    let contentInputBoxCLR = document.getElementById("contentInputBox");
    let giphytextsearchCLR = document.getElementById("giphytextsearch");
    let giphyPreviewDivCLR= document.getElementById("newJournalGiphyPreview");

    contentInputBoxCLR.value = "";
    giphytextsearchCLR.value = "";
    giphyPreviewDivCLR.innerHTML = "";


    //Create variable for comment added tracking.
    let commentsAdded = 0;
    let viewAllAdded = false;



    //Sort our journals and comments in descending order by id
    journalData.sort((a,b) => parseInt(b.id) - parseInt(a.id));
    commentData.sort((a,b) => parseInt(b.id) - parseInt(a.id));

    let journalsAdded = 0;

    //Loop through our journals
    journalData.forEach((jrnl) =>
    {
        if(journalsAdded < journalsPerPage)
        {
            //reset comments added variable
            commentsAdded = 0;

            //******  JOURNAL ********/

            //Create new journal div, set it's id to current jrnl.id +div  ( i.e.  5div )
            let journalDiv = document.createElement("div");
            journalDiv.setAttribute("id",jrnl.id+"div");
            journalDiv.classList.add("journaldiv");
            journalDiv.classList.add("card");

            //Create P element to display journal id
            let journalIDP = document.createElement("p");
            journalIDP.setAttribute("id",jrnl.id+ "idp");
            journalIDP.innerText = "Journal id:" + jrnl.id;
            journalIDP.classList.add("journalId");


            //Create P element to display journal content
            let journalContentP = document.createElement("p");
            journalContentP.setAttribute("id",jrnl.id+"contentp");
            journalContentP.innerText = jrnl.content;
            journalContentP.classList.add("journalContent");
            
            //Create a P element to display giphy
            let journalGiphyP = document.createElement("div");
            journalGiphyP.setAttribute("id",jrnl.id+"giphyp");
            journalGiphyP.innerHTML = `<img src = ${jrnl.giphy}>`;
            journalGiphyP.classList.add("journalGiphy");

            //create a div element to display reactions
            let journalReactionDiv = document.createElement("div");
            journalReactionDiv.setAttribute("id","jrnl"+jrnl.id+"reactionDiv");
            journalReactionDiv.classList.add("JournalReactionDiv");

            //create inner divs for values and emojis
            let journalReactionvalue1 = document.createElement("div");
            journalReactionvalue1.setAttribute("id","jrnl"+jrnl.id+"reactValueDiv"+1);
            journalReactionvalue1.innerHTML = jrnl.reactions[0];
            journalReactionvalue1.classList.add("journalReactionValue")

            let journalReactionEmoji1 = document.createElement("div");
            journalReactionEmoji1.setAttribute("id","jrnl"+jrnl.id+"reactEmojiDiv"+1);
            journalReactionEmoji1.innerHTML=":)";
            journalReactionEmoji1.classList.add("JournalReactionEmoji");

            let journalReactionvalue2 = document.createElement("div");
            journalReactionvalue2.setAttribute("id","jrnl"+jrnl.id+"reactValueDiv"+2);
            journalReactionvalue2.innerHTML = jrnl.reactions[1];
            journalReactionvalue2.classList.add("JournalReactionValue");

            let journalReactionEmoji2 = document.createElement("div");
            journalReactionEmoji2.setAttribute("id","jrnl"+jrnl.id+"reactEmojiDiv"+2);
            journalReactionEmoji2.innerHTML=":|";
            journalReactionEmoji2.classList.add("JournalReactionEmoji");

            let journalReactionvalue3 = document.createElement("div");
            journalReactionvalue3.setAttribute("id","jrnl"+jrnl.id+"reactValueDiv"+3);
            journalReactionvalue3.innerHTML = jrnl.reactions[2];
            journalReactionvalue3.classList.add("JournalReactionValue");

            let journalReactionEmoji3 = document.createElement("div");
            journalReactionEmoji3.setAttribute("id","jrnl"+jrnl.id+"reactEmojiDiv"+3);
            journalReactionEmoji3.innerHTML=":(";
            journalReactionEmoji3.classList.add("JournalReactionEmoji");

            //Put the reaction div together

            journalReactionDiv.appendChild(journalReactionvalue1);
            journalReactionDiv.appendChild(journalReactionEmoji1);

            journalReactionDiv.appendChild(journalReactionvalue2);
            journalReactionDiv.appendChild(journalReactionEmoji2);

            journalReactionDiv.appendChild(journalReactionvalue3);
            journalReactionDiv.appendChild(journalReactionEmoji3);

            //***** JOURNAL - COMMENT FORM ******/

            //create div for adding comments
            let journalCommentInputDiv = document.createElement("div");
            journalCommentInputDiv.setAttribute("id",jrnl.id+"cmtInputDiv");
            journalCommentInputDiv.classList.add("JournalCommentInputDiv");

            //create form for adding comments
            let journalCommentForm = document.createElement("form");
            journalCommentForm.setAttribute("id",jrnl.id+"cmtform");
            journalCommentForm.classList.add("journalCommentForm")

            //Create text input box for adding comments
            let journalCommentInput = document.createElement("input");
            journalCommentInput.setAttribute("id", jrnl.id+"cmtInput");
            journalCommentInput.type = "text";
            journalCommentInput.classList.add("journalCommentInput");

            //create giphy search bar for adding giphy to comment
            let journalCommentGiphySearch = document.createElement("input");
            journalCommentGiphySearch.setAttribute("id",jrnl.id+"cmtGiphySearch");
            journalCommentGiphySearch.type = "text";
            journalCommentGiphySearch.classList.add("JournalCommentGiphySearchBar");

            //create giphy button for adding giphy to comment
            let journalCommentGiphyBtn = document.createElement("input");
            journalCommentGiphyBtn.type = "submit";
            journalCommentGiphyBtn.setAttribute("id","commentGiphyBtn");
            journalCommentGiphyBtn.value = "Select Giphy";
            journalCommentGiphyBtn.name = jrnl.id+"commentGiphyBtn";
            journalCommentGiphyBtn.classList.add("journalCommentGiphySearchBtn");

            //create giphy preview div
            let journalCommentGiphyPreview = document.createElement("div");
            journalCommentGiphyPreview.setAttribute("id",jrnl.id+"cmtGiphyPreview");
            journalCommentGiphyPreview.classList.add("journalCmtGiphyPreview");

            //create button to submit comment
            let journalCommentInputSubmit = document.createElement("input");
            journalCommentInputSubmit.setAttribute("id","submitJournalComment");
            journalCommentInputSubmit.type = "submit";
            journalCommentInputSubmit.value = "Submit Comment";
            journalCommentInputSubmit.name = jrnl.id;
            journalCommentInputSubmit.classList.add("journalCommentInputSubmitBtn");


            //******* PUT ALL TOGETHER *******/

            //Put the comment input form together
            journalCommentForm.appendChild(journalCommentInput);
            journalCommentForm.appendChild(journalCommentGiphySearch);
            journalCommentForm.appendChild(journalCommentGiphyBtn);
            journalCommentForm.appendChild(journalCommentGiphyPreview);
            journalCommentForm.appendChild(journalCommentInputSubmit);


            //Put the journal together
            journalDiv.appendChild(journalIDP);
            journalDiv.appendChild(journalContentP);
            journalDiv.appendChild(journalGiphyP);
            journalDiv.appendChild(journalReactionDiv);
            journalDiv.appendChild(journalCommentInputDiv);

            //Add comment form to journal
            journalDiv.appendChild(journalCommentForm);

            //Add the completed journalDiv to displayJournalsSection
            document.getElementById("displayJournalsSection").appendChild(journalDiv);
            
            journalsAdded++;

            //********* NOW LETS SORT OUR COMMENTS *********/

            //Then loop through the comments
            commentData.forEach((cmt) =>
            {  
                //Check commentsAdded is less than our global variable if we're not targetting a journal, or if we are just display all.
                if(journalTargetted === true || journalTargetted === false && commentsAdded < NR_CMTS)
                {
                    //and if the current comment.jounralId === journal.id, add it on beneath the current journal
                    if (parseInt(cmt.journalId) === parseInt(jrnl.id))
                    {
                        //create a new comment div
                        let cmtDiv = document.createElement("div");
                        cmtDiv.setAttribute("id",cmt.id+"cmtdiv");
                        cmtDiv.classList.add("commentDiv");
                        cmtDiv.classList.add("card")

                        //create a p to store comment id
                        let cmtIdP = document.createElement("p");
                        cmtIdP.setAttribute("id",cmt.id+"idp");
                        cmtIdP.innerText = "Comment id: " +cmt.id;
                        cmtIdP.classList.add("commentId");

                        //create a p to store comment content
                        let cmtContentP = document.createElement("p");
                        cmtContentP.setAttribute("id",cmt.id+"contentp");
                        cmtContentP.innerText = cmt.content;
                        cmtContentP.classList.add("commentContent");

                        //create a p to store comment giphy
                        let cmtGiphyP = document.createElement("p");
                        cmtGiphyP.setAttribute("id",cmt.id+"giphyp");
                        cmtGiphyP.innerHTML = `<img src = ${cmt.giphy}>`;
                        cmtGiphyP.classList.add("commentGiphyP");

                        //create reaction divs for values and emojis
                        let cmtReactionDiv = document.createElement("div");
                        cmtReactionDiv.setAttribute("id","cmt"+cmt.id+"reactionDiv");
                        cmtReactionDiv.classList.add("commentReactionDiv");

                            let cmtReactionvalue1 = document.createElement("div");
                            cmtReactionvalue1.setAttribute("id","cmt"+cmt.id+"reactValueDiv"+1);
                            cmtReactionvalue1.innerHTML = cmt.reactions[0];
                            cmtReactionvalue1.classList.add("commentReactionValue");

                            let cmtReactionEmoji1 = document.createElement("div");
                            cmtReactionEmoji1.setAttribute("id","cmt"+cmt.id+"reactEmojiDiv"+1);
                            cmtReactionEmoji1.innerHTML=":)";
                            cmtReactionEmoji1.classList.add("commentReactionEmoji");

                            let cmtReactionvalue2 = document.createElement("div");
                            cmtReactionvalue2.setAttribute("id","cmt"+cmt.id+"reactValueDiv"+2);
                            cmtReactionvalue2.innerHTML = cmt.reactions[1];
                            cmtReactionvalue2.classList.add("commentReactionValue");

                            let cmtReactionEmoji2 = document.createElement("div");
                            cmtReactionEmoji2.setAttribute("id","cmt"+cmt.id+"reactEmojiDiv"+2);
                            cmtReactionEmoji2.innerHTML=":|";
                            cmtReactionEmoji2.classList.add("commentReactionEmoji");

                            let cmtReactionvalue3 = document.createElement("div");
                            cmtReactionvalue3.setAttribute("id","cmt"+cmt.id+"reactValueDiv"+3);
                            cmtReactionvalue3.innerHTML = cmt.reactions[2];
                            cmtReactionvalue3.classList.add("commentReactionValue");

                            let cmtReactionEmoji3 = document.createElement("div");
                            cmtReactionEmoji3.setAttribute("id","cmt"+cmt.id+"reactEmojiDiv"+3);
                            cmtReactionEmoji3.innerHTML=":(";
                            cmtReactionEmoji3.classList.add("commentReactionEmoji");

                        //Put them together
                        cmtReactionDiv.appendChild(cmtReactionvalue1);
                        cmtReactionDiv.appendChild(cmtReactionEmoji1);

                        cmtReactionDiv.appendChild(cmtReactionvalue2);
                        cmtReactionDiv.appendChild(cmtReactionEmoji2);

                        cmtReactionDiv.appendChild(cmtReactionvalue3);
                        cmtReactionDiv.appendChild(cmtReactionEmoji3);

                        //Add them all together
                        cmtDiv.appendChild(cmtIdP);
                        cmtDiv.appendChild(cmtContentP);
                        cmtDiv.appendChild(cmtGiphyP);
                        cmtDiv.appendChild(cmtReactionDiv);

                        //Add them onto our journal section below their respective journal.
                        let journalTarget = document.getElementById(cmt.journalId+"div");
                        journalTarget.appendChild(cmtDiv);

                        //add one to comments added
                        commentsAdded ++
                    }
                }
                //If we've displayed too many comments...
                else if(journalTargetted === false && commentsAdded >= NR_CMTS && viewAllAdded === false)
                {
                    //set target journaldiv
                    let target = document.getElementById(cmt.journalId+"div");
                        

                    //create a button element that contains a link to view all comments on the journal
                    let viewAllCommentsBtn = document.createElement("input");
                    viewAllCommentsBtn.setAttribute("id",jrnl.id+"viewAllCmtsButton");
                    viewAllCommentsBtn.type = "submit";
                    viewAllCommentsBtn.value = "View all comments";
                    viewAllCommentsBtn.classList.add("ViewAllCommentsBtn");
                    //Add this button onto the journal div
                    target.appendChild(viewAllCommentsBtn);
                    
                    viewAllAdded= true;

                    //Add event listener to it
                    viewAllCommentsBtn.addEventListener('click', event =>
                    {
                            displayTargetJournal(cmt.journalId);
                    })
                }
            
            });
        }
                
    });
    //Add event handlers
    addEventHandlers();

    //Add pagination controls at the end.
        let paginationDiv = document.createElement("pagination_div");
        paginationDiv.setAttribute("id","pagination_div");

        let btn_next = document.createElement("button");
        btn_next.setAttribute("id","btn_next");
        btn_next.innerHTML ="Next";

        let btn_prev = document.createElement("button");
        btn_prev.setAttribute("id","btn_prev");
        btn_prev.innerHTML="Prev";

        let page_span = document.createElement("span");
        page_span.setAttribute("id","page_span");
        page_span.innerHTML="Page: " +current_page+ " / " + await numPages();
        
        let target = document.getElementById("displayJournalsSection");

        paginationDiv.appendChild(btn_prev);
        paginationDiv.appendChild(page_span);
        paginationDiv.appendChild(btn_next);

        target.appendChild(paginationDiv);

        btn_next.addEventListener('click',nextPage);
        btn_prev.addEventListener('click',prevPage);
    if(journalTargetted === false)
    {
        paginationDiv.classList.add("hidden");
    }
    else
    {
        paginationDiv.classList.add("visible");
    }
     
}





//****************************** GET CODE BELOW *******************/*/


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



// ******************  POST CODE BELOW ********************* //




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
        .then(changePage(1))
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
        .then(changePage(1))
        .catch((error) => alert ("Couldn't post comment, reason: " + error));
    };


}

// ************** UPDATE CODE BELOW ********************** //


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

function addGiphytoComment(journalId, searchTerm)
{
    let url = `https://api.giphy.com/v1/gifs/search?api_key=${apikey}&limit=16&q=`;
    let targetDiv = document.getElementById(journalId+"cmtGiphyPreview");
    targetDiv.innerHTML = "";

    str= searchTerm.replace(" ", "+")
    url = url.concat(str.trim())
    fetch(url)
    .then(response => response.json())
    .then( content => {
 
        if(document.getElementById("cImg0"))
        {
            alert("already selecting a giphy - commenting on a different journal?")
        }
        else
        {

            for( let i = 0; i < NR_GIF; i++)
            {

                targetDiv.innerHTML = targetDiv.innerHTML + ` <img id=cImg${i} src = "${content.data[i].images.downsized.url}" width=22.5% > ` ;
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
    
    str= searchTerm.replace(" ", "+")
    url = url.concat(str.trim())
    fetch(url)
    .then(response => response.json())
    .then( content => {
 
        for( let i = 0; i < NR_GIF; i++)
        {
            targetDiv.innerHTML = targetDiv.innerHTML + ` <img id=jImg${i} src = "${content.data[i].images.downsized.url}" width=22.5% > ` ;
        }

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


//**************** PAGINATION CODE **********//

async function prevPage()
{
    page_span = document.getElementById("page_span");
    let num_Pages = await numPages();
    
    if (current_page > 1) 
    {
        current_page--;
        page_span.value = current_page + " / " + num_Pages;
        changePage(current_page);
    }
}

async function nextPage()
{
    page_span = document.getElementById("page_span");
    let num_Pages = await numPages();

    console.log("next clicked");
    console.log("current page is: " +current_page)
    console.log("numpages is: " + num_Pages);
    
    if (current_page < num_Pages) 
    {
        current_page++;
        page_span.value = "Page:" + current_page + " / " + num_Pages;
        changePage(current_page);
    }
}

async function numPages()
{
    let journals = await getJournals();
    let journalsLength = 0;

    journals.forEach((jrnl) => 
    {
        journalsLength++;
    })

    return Math.ceil( journalsLength/ journalsPerPage);
}

// END OF CODE