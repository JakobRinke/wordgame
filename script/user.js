var USERNAME = ""

function loadUser()
{
    USERNAME = localStorage.getItem("username") 
    if (USERNAME==null) { USERNAME = (Math.random()*100000).toString(); }
}

try 
{
    loadUser()
    document.getElementById("username").value = USERNAME
    document.getElementById("username").innerHTML = USERNAME
  
} 
catch {}


function onUsernameUpdate(el)
{
    localStorage.setItem("username", el.value);
    USERNAME = el.value;
    console.log(USERNAME)
}