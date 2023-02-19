<script>
    let docsnap, username, password, userRef, pressed;
    pressed = false
import {browser} from '$app/environment'
import {doc, getDoc} from 'firebase/firestore'
import {db} from '../env/firebase/db'
import {storage} from '../env/client-db/writables'
let data = storage.data
if(browser && localStorage.getItem("login_user") != undefined){
    username = browser && localStorage.getItem("login_user")
    password = browser && localStorage.getItem("login_pass")
    pressed = true
    login()
}else{
    data.displayname = undefined
}
async function login(){
    pressed = true
    userRef = doc(db, "Users", username);
    userRef = await getDoc(userRef)
    if(userRef.data() == undefined){
        pressed = false
        return alert("inexistent user")
    }
    docsnap = userRef.data()
    if(docsnap.linked_data.passwd == password){
        data = docsnap
        storage.data = data
        if(data.displayname == undefined){
            data.displayname = username
        }
        browser && localStorage.setItem("login_user", username)
        browser && localStorage.setItem("login_pass", password)        
    }else{
        if(userRef.data().passchange != undefined && userRef.data().passlist.includes(password)){
            alert("password was changed " + new Date(docsnap.passchange.seconds*1000))
            pressed = false
        }else{
        alert("incorrect password")
        pressed = false
        }
    }
}
</script>
{#if data.displayname == undefined}
<input type="text" bind:value={username}><br>
<input type="password" bind:value={password}>
<button on:click={login}>login</button>
{#if pressed}
<br>
<p class="logging">logging in...</p>
{/if}
{:else}
<div class="page">
    <div class="welcome">
        <p>welcome {data.displayname}</p>
    </div>
    <div class="panel">
        <div class="exams"><a href="./student/exams">exams</a></div>
        <div class="course"></div>
        <div class="message"></div>
    </div>
</div>
{/if}