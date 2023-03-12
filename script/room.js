const WordInput = document.getElementById("wordInp");
const WordContainer = document.getElementById("wordContainer");
const gameStateWordDiv = document.getElementById("gamestate_word");
const gameStateGameDiv = document.getElementById("gamestate_game");
const wordcountDiv = document.getElementById("wordcount");
const wordstateDiv = document.getElementById("wordstate");
const UserTurnDiv = document.getElementById("USER_Dran");


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const create = urlParams.get("create")=="true"
const players = urlParams.get("players");



function deactivateElement(el)
{
    el.style.visibility = "hidden"
    el.style.pointer_events = "none"
}

if (!create)
{
    deactivateElement(document.getElementById("gamestarter"))
    deactivateElement(document.getElementsByClassName("changeButton")[0])
    deactivateElement(document.getElementsByClassName("changeButton")[1])
}

var roomID;

if (players==null) {
    try {
        roomID = parseInt(urlParams.get("roomID"));
        addPlayer(USERNAME);
    }catch {}
} else {
    console.log(players)
    roomID  = createRoom();
    var pl = players.split("---");
    for (p in pl) {
        addPlayer(pl[p]);
    }
}


document.getElementById("RoomID").innerHTML = "Raum ID: " + roomID

var Wordlist = [];
var Playerlist = [];
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
    Wordlist.sort();
    Wordlist = shuffle(Wordlist, roomID);
    wordcountDiv.innerHTML = "Wortanzahl: " + Wordlist.length
}

function onPlayersChange(data, key)
{
    if (!Playerlist.includes(data))
    {
        Playerlist.push(data)
    }
    Playerlist.sort();
    Playerlist = shuffle(Playerlist, roomID);
   // wordcountDiv.innerHTML = "Wortanzahl: " + Wordlist.length
}

function onRoundChange(data, key)
{
    Wordlist.sort();
    Wordlist = shuffle(Wordlist, roomID);
    Round = data
    updateWordState()
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
    Wordlist.sort();
    Wordlist = shuffle(Wordlist, roomID);
    started = data
    if(started)
    {
        wordsMixed = [...Wordlist];
        wordsMixed.sort();
        shuffle(wordsMixed);
        updateWordState()
 
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

function updateWordState()
{
    wordstateDiv.innerHTML = "Wort: " +( Round + 1) + " / " + Wordlist.length;
    UserTurnDiv.innerHTML = "Am Zug: " + Playerlist[Round%Playerlist.length];
}






subscribeRoomEvents(roomID, onStartChange, onWordsChange, onRoundChange, onPlayersChange);