const gun = Gun(['https://gun-manhattan.herokuapp.com/gun']);





function roomExists(roomID)
{
    return gun.get("wordgame/rooms/").get(roomID).get("started").once(logRoom)
}

function createRoom()
{
    roomID = parseInt(Math.random() * 100000)
    gun.get("wordgame/rooms/").get(roomID).get("started").put(false)
    gun.get("wordgame/rooms/").get(roomID).get("round").put(0)
    return roomID;
}


function logRoom(data, key)
{
    console.log(data!=null)
    console.log(data)
}

function addPlayer(name)
{
    var terminate = false
    gun.get("wordgame/rooms/").get(roomID).get("started").once(k=>{
        if (k) {return; }
        gun.get("wordgame/rooms/").get(roomID).get("users").once().map().once((key, value)=>{
            terminate = terminate||value==name
        })
        if (terminate) { return; }
        gun.get("wordgame/rooms/").get(roomID).get("users").set(name);
    });
}

function addWord(roomID,word)
{
    gun.get("wordgame/rooms/").get(roomID).get("started").once(function(data, key) {
        if (data==null || data) {console.log(data); return;}
        gun.get("wordgame/rooms/").get(roomID).get("words").set(word)
        console.log("set")
    })
}

function start(roomID)
{
    gun.get("wordgame/rooms/").get(roomID).get("started").put(true)
}


function nextRound(roomID)
{
    gun.get("wordgame/rooms/").get(roomID).get("started").once(function(data, key) {
        if (data==null || !data) {console.log(data);return; }
        array = gun.get("wordgame/rooms/").get(roomID).get("round").once(function (round, k) {  
            round++;
            gun.get("wordgame/rooms/").get(roomID).get("round").put(round)
        });
       
    })
}

function setRound(roomID, round)
{
    gun.get("wordgame/rooms/").get(roomID).get("round").put(round);
}


function lastRound(roomID)
{
    gun.get("wordgame/rooms/").get(roomID).get("started").once(function(data, key) {
        if (data==null || !data) {return; }
        array = gun.get("wordgame/rooms/").get(roomID).get("round").once(function (round, k) {
 
            if (round-1 < 0) {return; }
            round--;
            gun.get("wordgame/rooms/").get(roomID).get("round").put(round)

        });
       
    })
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function subscribeRoomEvents(roomID, onStartChange, onWordsChange, onRoundChange, PlayerChange)
{
    gun.get("wordgame/rooms/").get(roomID).get("started").on(onStartChange);
    gun.get("wordgame/rooms/").get(roomID).get("words").map().on(onWordsChange);
    await sleep(1000)
    gun.get("wordgame/rooms/").get(roomID).get("users").map().on(PlayerChange);
    gun.get("wordgame/rooms/").get(roomID).get("round").on(onRoundChange);
}