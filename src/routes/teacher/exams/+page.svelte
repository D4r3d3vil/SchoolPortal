<script>
    let docsnap, data, username, password, userRef, pressed;
import {browser} from '$app/environment'
import {doc, getDoc} from 'firebase/firestore'
import {db} from '../../env/firebase/db'
username = browser&&localStorage.getItem("teacher_user")
password = browser&&localStorage.getItem("teacher_pass")
async function get_data(){
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
if(browser&&localStorage.getItem("teacher_user")){
    get_data()
}
</script>
{#if data == undefined}
{#if pressed}
<br>
<p class="logging">loading...</p>
{:else}
<p>please <a href="./">sign in</a></p>
{/if}
{:else}
<div class="panel">
    <div class="new">
        <a href="./exams/new/">new exam</a><br>
    </div>
    <div class="data"></div>
</div>
{/if}