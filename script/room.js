const WordInput = document.getElementById("wordInp");
const WordContainer = document.getElementById("wordContainer");
const gameStateWordDiv = document.getElementById("gamestate_word");
const gameStateGameDiv = document.getElementById("gamestate_game");


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const create = urlParams.get("create")=="true"


const roomID = parseInt(urlParams.get("roomID"));


document.getElementById("RoomID").innerHTML = "Raum ID: " + roomID

var Wordlist = [];
var Round = 0;
var started = false;

var wordsMixed;


function onWordAdd()
{
    var word = String(WordInput.value);
    if (word.trim()=="")
    {
        return;
    }
    word = word.toLowerCase()
    addWord(roomID, word)
    WordInput.value = ""
}


function onWordsChange(data, key)
{
    if (!Wordlist.includes(data))
    {
        Wordlist.push(data)
    }

}

function onRoundChange(data, key)
{
    Round = data
    if(!started)
    {
        return;
    }

    try
    {
        if (Round >= wordsMixed.length)
        {
            setRound(roomID, wordsMixed.length-1)
            return;
        }
    }
    catch 
    {
        if (Round >= Wordlist.length)
        {
            setRound(roomID, Wordlist.length-1)
            return;
        }
    }


    if(started==true)
    {
        try
        {
            WordContainer.innerHTML = wordsMixed[Round]
        }
        catch(e)
        {
            console.log(e)
            WordContainer.innerHTML = "Fehler, Bitte Neutstarten"
        }      
    }
}

function onStartChange(data, key)
{
    started = data
    console.log(started)
    if(started)
    {
        wordsMixed = shuffle(sort(Wordlist), roomID);

        gameStateGameDiv.classList.add('gamestate_visible');
        gameStateGameDiv.classList.remove('gamestate_invisible');
        
        gameStateWordDiv.classList.add('gamestate_invisible');
        gameStateWordDiv.classList.remove('gamestate_visible');

        try
        {
            WordContainer.innerHTML = wordsMixed[Round]
        }
        catch(e)
        {
            console.log(e)
            WordContainer.innerHTML = "Fehler, Bitte Neutstarten"
        }      
    }
    else 
    {
        gameStateGameDiv.classList.add('gamestate_invisible');
        gameStateGameDiv.classList.remove('gamestate_visible');
        
        gameStateWordDiv.classList.add('gamestate_visible');
        gameStateWordDiv.classList.remove('gamestate_invisible');
    }
}








subscribeRoomEvents(roomID, onStartChange, onWordsChange, onRoundChange);