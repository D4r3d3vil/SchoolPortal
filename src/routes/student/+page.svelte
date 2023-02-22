<script>
    let docsnap, username, password, userRef, pressed;
docsnap =""
username = browser && localStorage.getItem("login_user")
password = browser && localStorage.getItem("login_pass")
    pressed = false
import {browser} from '$app/environment'
import {doc, getDoc} from 'firebase/firestore'
import {db} from '../env/firebase/db'
async function get_data(){
docsnap = ""
userRef = doc(db, "Users", username);
userRef = await getDoc(userRef)
    if(userRef.data() == undefined){
        pressed = false
        return alert("inexistent user")
    }
    if(userRef.data().linked_data.passwd == password){
        docsnap = userRef.data()   
    }else{
        if (userRef.data().passchange && userRef.data().passlist.includes(password)) {
        alert("password was changed " + new Date(userRef.data().passchange))
        }else{
            alert("Wrong password")
        }
        pressed = false
        browser&&localStorage.clear()
    }
}
if(browser&&localStorage.getItem("login_user")){
get_data()
}
</script>
{#if docsnap == ""}
<input type="text" bind:value={username}><br>
<input type="password" bind:value={password}>
<button on:click={get_data}>login</button>
{#if pressed}
<br>
<p class="logging">logging in...</p>
{/if}
{:else}
<div class="page">
    <div class="welcome">
        <p>welcome {username}</p>
    </div>
    <div class="panel">
        <div class="exams"><a href="./student/exams">exams</a></div>
        <div class="course"></div>
        <div class="message"></div>
    </div>
</div>
{/if}