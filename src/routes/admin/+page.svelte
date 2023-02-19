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
    pressed = true
    userRef = doc(db, "Admins", username);
    userRef = await getDoc(userRef)
    if(userRef.data() == undefined){
        pressed = false
        return alert("inexistent user")
    }
    docsnap = userRef.data()
    if(docsnap.linked_data.passwd == password){
        data = docsnap
        if(data.displayname == undefined){
            data.displayname = username
        }
        browser && localStorage.setItem("admin_user", username)
        browser && localStorage.setItem("admin_pass", password)        
    }else{
        if(browser && localStorage.getItem("login_user") != undefined && docsnap.passchange != undefined && docsnap.passlist.includes(password)){
            pressed = false
            alert("password was changed " + docsnap.passchange)
        }else{
            pressed = false
        alert("incorrect password")
        }
    }
}
async function create(){
await setDoc(doc(db, "Users", newuser), {data:{exams:{}, inbox:{}}, linked_data:{}})
alert("created")
}
async function createt(){
    await setDoc(doc(db, "Teachers", tuser), {exams:{}, inbox:{}, linked_data:{}, password:tpass})
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
    <div class="adminpanel"><div class="createuser">
        <h3>Add user: </h3><div class="form"><input type="text" class="user" placeholder="username" bind:value={newuser}><br> <input type="text" class="password" placeholder="password" bind:value={newpass}><br><button class="createuser" on:click={create}>Create</button></div><br>
        <h3>Add teacher: </h3><div class="form"><input type="text" class="user" placeholder="username" bind:value={tuser}><br> <input type="text" class="password" placeholder="password" bind:value={tpass}><br><button class="createuser" on:click={createt}>Create</button></div>
    </div></div>
</div>
{/if}