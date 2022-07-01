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

function updateDOM(){

    resultsArray.forEach((result) => {
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
        saveText.textContent = 'Add To Favorites';
        saveText.setAttribute('onclick',  `saveFavorite('${result.url}')`);
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

//Get 10 Imgs from NASA APOD API
async function getNasaPictures(){
    try{    
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        updateDOM();
        console.log(resultsArray);
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