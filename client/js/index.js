// Create array of all input buttons of type submit wrapped in a form
const button = document.querySelectorAll("form input[type ='submit']");

//check length for testing
console.log("button array length: " +button.length);

// Add event listeners to each button in button array
button.forEach( function (thisButton)
{
    console.log("Adding event listener for " +thisButton.id)
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
        console.log("submit clicked");
        sumbitJournal();
    }
    // If choice === refreshJournals // do stuff
    else if (choice === 'refreshJournals')
    {
        console.log("refresh clicked");
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


function showAllJournals()
{

    fetch("http://localhost:3000/allJournals")
    .then( (resp) => resp.json())
    .then( (data) => 
    {
        data.forEach((item) =>
        {
            let paragraph = document.createElement("p");
            let paragraphContent = document.createTextNode(JSON.stringify(item.content));

            paragraph.appendChild(paragraphContent);
            document.getElementById("displayJournalsSection").appendChild(paragraph );
        });

    });

}