//initial variables
const body = document.getElementsByTagName('body');
const icon = document.querySelector('.icon');
const searchBar = document.querySelector('input');
const filterList = document.createElement('ul');
const filterArray = [1, 2, 3];


//adding classes
filterList.setAttribute('class', 'filter-elements');


//append initial variables to DOM
filterList.append();


//dynamic search bar
icon.addEventListener('click', function(){
    searchBar.classList.toggle('active');
});


//function to initiate search using 'Enter' key
searchBar.addEventListener('keypress', function(e){
    if(e.key === 'Enter'){
        //code to search
    }
});


//populate filters
for(let i = 0; i < filterArray.length; i++){
    let filterItems = document.createElement('li');
    filterItems.textContent = '1';
    filterList.appendChild(filterItems);
}
