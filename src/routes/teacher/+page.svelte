<script>
    let docsnap, data, username, password, userRef, pressed;
import {browser} from '$app/environment'
import {doc, getDoc} from 'firebase/firestore'
import {db} from '../env/firebase/db'
if(browser && localStorage.getItem("teacher_user") != undefined){
    username = browser && localStorage.getItem("teacher_user")
    password = browser && localStorage.getItem("teacher_pass")
    login()
}
async function login(){
    pressed = true
    userRef = doc(db, "Teachers", username);
    userRef = await getDoc(userRef)
    if(userRef.data() == undefined){
        pressed = false
        return alert("inexistent user")
    }
    docsnap = userRef.data()
    if(docsnap.password == password){
        data = docsnap
        if(data.displayname == undefined){
            data.displayname = username
        }
        browser && localStorage.setItem("teacher_user", username)
        browser && localStorage.setItem("teacher_pass", password)        
    }else{
        if(docsnap.passchange != undefined && docsnap.passlist.includes(password)){
            pressed = false
            alert("password was changed " + new Date(docsnap.passchange*1000))
        }else{
            pressed = false
        alert("incorrect password")
        }
    }
}
</script>
{#if data == undefined}
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
        <div class="exams"><a href="./teacher/exams">exams</a></div>
        <div class="course"></div>
        <div class="message"></div>
    </div>
</div>
{/if}