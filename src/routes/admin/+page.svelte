<script>
    let docsnap, data, username, password, userRef, newuser, newpass, tuser, tpass, pressed;
import {browser} from '$app/environment'
import {doc, getDoc, setDoc} from 'firebase/firestore'
import {db} from '../env/firebase/db'
if(browser && localStorage.getItem("admin_user") != undefined){
    username = browser && localStorage.getItem("admin_user")
    password = browser && localStorage.getItem("admin_pass")
    login()
}
async function login(){
    docsnap = ""
userRef = doc(db, "Admins", username);
userRef = await getDoc(userRef)
console.log(password)
console.log(userRef.data().linked_data.passwd)
    if(userRef.data() == undefined){
        pressed = false
        return alert("inexistent user")
    }
    if(userRef.data().linked_data.passwd == password){
        docsnap = userRef.data()
        browser&&localStorage.setItem("admin_user", username)
        browser&&localStorage.setItem("admin_pass", password)
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
<div class="datapage">
    <div class="welcome">
        <p>welcome {data.displayname}</p>
    </div>
    <div class="adminpanel">
        <a href="./groups">groups</a>
        <a href="./students">students</a>
        <a href="./teachers">teachers</a>
    </div>
</div>
{/if}