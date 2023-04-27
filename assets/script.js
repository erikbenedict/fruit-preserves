const srcForm = document.getElementById('searchDiv');
const srcBar = document.getElementById('srcInput');
const prevSearches = document.getElementById('previousSearches');

let srcSubmitHandler = function (event) {
    event.preventDefault();
    let searchedTerm = srcBar.value.trim();
    console.log(searchedTerm);
    if (searchedTerm){
        localStorage.setItem('thisSearch', searchedTerm);
        saveSearches(searchedTerm)
        //call function to get data from api
        console.log(sessionStorage);
        srcBar.value = '';
    } else {
        alert('Please enter a valid search term')
    }
};

let saveSearches = function(searchedTerm){
    let previousSearches = [];
    for (i = 0; i > 5; i++){
        searchedTerm = previousSearches[i]
        console.log(previousSearches);
    };
    let newSavedSrc = document.createElement('p');
    let newSavedSrcText = document.createTextNode(searchedTerm);
    newSavedSrc.appendChild(newSavedSrcText);
    document.getElementById('previousSearches').appendChild(newSavedSrc);
    //if search history isn't empty, create a new item in search history div
}

//need to instead add each new search to an array

srcForm.addEventListener('submit', srcSubmitHandler);
