// targeting all DOM elements with the "fa-trash" class
const deleteBtn = document.querySelectorAll('.fa-trash')

// targeting all <span> tags where the parent has the class of "item"
const item = document.querySelectorAll('.item span')

// targeting all <span> tags with the class of "complete" where the parent has the class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed')

// create an array from the queryselector returns, loops through all, and add a "click" event listener that fires the "deleteItem" function
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// create an array from the queryselector returns, loops through all, and add a "click" event listener that fires the "markcomplete" function
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// create an array from the queryselector returns, loops through all, and add a "click" event listener that fires the "markuncomplete" function
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})


async function deleteItem(){
    // traverses the dom up to the parent (li) and gets the text inside of the first <span> element
    const itemText = this.parentNode.childNodes[1].innerText
     
    try{
        // sends a delete request to the "deleteitem" endpoint, sets the headers to expect a json response, and the itemText variable contents in the body.
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          // waiting for response, parsing json
        const data = await response.json()
        console.log(data)
        // reload the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    // traverses the dom up to the parent (li) and gets the text inside of the first <span> element
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // sends a PUT request to the "markComplete" endpoint, sets the headers to expect a json response, and the itemText variable contents in the body.
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          // waits for response, parse json
        const data = await response.json()
        console.log(data)
        // reload the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
        // traverses the dom up to the parent (li) and gets the text inside of the first <span> element

    const itemText = this.parentNode.childNodes[1].innerText
    try{
                // sends a PUT request to the "markUnComplete" endpoint, sets the headers to expect a json response, and the itemText variable contents in the body.

        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
         // waits for response, parse json

        const data = await response.json()
        console.log(data)
         // reload the page

        location.reload()

    }catch(err){
        console.log(err)
    }
}