//initial variables
const icon = document.querySelector('.icon');
const searchBar = document.querySelector('input');
const filterListDiv = document.querySelector('.filter-list-div');
const filter = document.querySelector('.filter');
const filterArray = [1, 2, 3];



//adding classes


//append initial variables to DOM



//dynamic search bar
icon.addEventListener('click', function(){
    searchBar.classList.toggle('active');
    let testItems = document.querySelectorAll('.test');
    for(let i =0; i < filterArray.length; i++){
        testItems[i].classList.toggle('hide');
    }
});


//function to initiate search using 'Enter' key
searchBar.addEventListener('keypress', function(e){
    if(e.key === 'Enter'){
        //code to search
    }
});


//populate filters
for(let i = 0; i < filterArray.length; i++){
    //create list elements for each index: filterArray
    let filterItems = document.createElement('li');
    filterItems.setAttribute('class', 'test waves-effect waves-light btn hide')
    filterItems.textContent = filterArray[i];
    filter.appendChild(filterItems);
}
