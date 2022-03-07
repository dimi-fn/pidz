// Create array of all input buttons of type submit wrapped in a form
const button = document.querySelectorAll("form input[type ='submit']");


// Add event listeners to each button in button array
button.forEach( function (thisButton)
{
    thisButton.addEventListener('click', buttonHandler);
});



function buttonHandler (submitEvent) 
{
    //prevent refresh
    submitEvent.preventDefault();

    //Get the id of the button that was clicked
    let choice = submitEvent.target.getAttribute("id");

    //If choice === testSubmitJournal  DO STUFF
    if (choice === 'testSubmitJournal')
    {
        sumbitJournal();
    }
    // If choice === refreshJournals // do stuff
    else if (choice === 'refreshJournals')
    {
        showAllJournals();
    }
    else
    {
        alert("Don't know what clicked, target is: " +submitEvent.target.getAttribute("id"));
    }
}


function sumbitJournal()
{

    let contentInput = document.getElementById("contentInputBox").value;
    console.log("content body to submit is " + contentInput);

    fetch("http://localhost:3000/newJournal", 
    {
        method: "POST",
        headers: { 'Content-Type' : 'application/Json'},
        body:   JSON.stringify({
            "id": 99,
            "content": contentInput,
            "reactions" : "",
            "giphy": ""
        })
    })
    .catch ((error) => alert ("Couldn't post, reason: " +error))
    

};


async function showAllJournals()
{
    let journalData = await getJournals();
    let commentData = await getComments();


    console.log("Journal data: " +journalData)
    console.log("Journal data: " +commentData)


    journalData.forEach((jrnl) =>
    {
        let paragraph = document.createElement("p");
        let paragraphContent = document.createTextNode(JSON.stringify(jrnl.content));
        paragraph.appendChild(paragraphContent);
        document.getElementById("displayJournalsSection").appendChild(paragraph );

        commentData.forEach((cmt) =>
        {
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



function getJournals ()
{
    return fetch("http://localhost:3000/allJournals")
        .then( (resp) => resp.json())
        .then( (jData) => 
        {
            return jData
        })
        .catch((error) => alert ("Couldn't get journals, reason: " +error));
}


function getComments ()
{
    return fetch("http://localhost:3000/allComments")
        .then( (resp) => resp.json())
        .then( (cData) => 
        {
            return cData
        })
        .catch((error) => alert ("Couldn't get comments, reason: " +error));
}
