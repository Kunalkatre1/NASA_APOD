//NASA API
const count = 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];

//Get 10 Imgs from NASA APOD API
async function getNasaPictures(){
    try{    
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        console.log(resultsArray);
    }catch(e){
        //Catch Error here
    }
}

//On Load run:
getNasaPictures();