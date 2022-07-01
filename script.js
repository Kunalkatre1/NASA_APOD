const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.getElementById('images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

//NASA API
const count = 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

//Show Content
function showContent(page){
    window.scrollTo({top: 0 , behavior: 'instant'});
    if(page === 'results'){
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    }
    else{
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }
    loader.classList.add('hidden');
}

//Function Remove Favorite
function removeFavorite(itemUrl){
    if(favorites[itemUrl]){
        delete favorites[itemUrl];
        //Set Favorites in localStorage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');
    }
}

function createDOMNodes(page){

    console.log(page);
    let loadPage = resultsArray;
    console.log('Favorite without object.values()', favorites);
    if(page === 'favorites'){
        //Convert favorites object into array so that for each can iterate over it
        loadPage = Object.values(favorites);
        console.log(loadPage);
    }

    loadPage.forEach((result) => {
        //Card Container
        const card = document.createElement('div');
        card.classList.add('card');
        //Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        //Image 
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Pic of the day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        //Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        //Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        //Save Text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if (page === 'results'){
            saveText.textContent = 'Add To Favorites';
            saveText.setAttribute('onclick',  `saveFavorite('${result.url}')`);
        }
        else{
            saveText.textContent = 'Remove Favorite';
            saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);
        }
        
        //Card Text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;
        //Footer Container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        //Date
        const date = document.createElement('strong');
        date.textContent = result.date;
        //Copyright
        const copyright = document.createElement('span');
        if(result.copyright !== undefined)
        copyright.textContent = `${result.copyright}`;
        else
        copyright.textContent = '';

        //Append the elements
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);       
    });

}

function updateDOM(whichPage){

    //Get Favorites from localStorage
    if(localStorage.getItem('nasaFavorites')){
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
        console.log('Favorites from localStorage',favorites);
    }
    imagesContainer.textContent = '';
    createDOMNodes(whichPage);
    showContent(whichPage);
}

//Get 10 Imgs from NASA APOD API
async function getNasaPictures(){

    //Display Loader
    loader.classList.remove('hidden');

    try{    
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        updateDOM('results');
    }catch(e){
        //Catch Error here
    }
}

//Add Favorite URL
function saveFavorite(itemUrl){
    //Loop through results array to select Favorite
    resultsArray.forEach((item) =>{ 
        if (item.url.includes(itemUrl) && !favorites[itemUrl]){
            favorites[itemUrl] = item;
            console.log(favorites);

            //Show save confirmation
            console.log(saveConfirmed);
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);

            //Set Favorites in local storage
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        }
    });
}

//On Load run:
getNasaPictures();