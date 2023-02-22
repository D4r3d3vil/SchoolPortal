<script>
let inexam, time, tenth, timerinit, username, password, userRef, docsnap, answerarr, answered, maxscore, score, refstr
refstr = ""
answered = []
answerarr = []
docsnap = ""
inexam = ""
import {browser} from '$app/environment'
import {doc, getDoc, setDoc} from 'firebase/firestore'
import {db} from '../../env/firebase/db'
username = browser && localStorage.getItem("login_user")
password = browser && localStorage.getItem("login_pass")
if (timerinit) {
                clearInterval(timerinit)
}
async function answer(ide, num){
   for (let i = 0; i < docsnap.data.exams[inexam].test.length; i++) {
    if (docsnap.data.exams[inexam].test[i].id == ide) {
    if (docsnap.data.exams[inexam].test[i].ans == num) {
        docsnap.data.exams[inexam].test[i].answeredas = true
    }else{
        docsnap.data.exams[inexam].test[i].answeredas = false
    }
   }
}
}
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
async function start(id){
    soft_refresh()
    for (let i = 0; i < docsnap.data.exams.length; i++) {
        if (docsnap.data.exams[i].id == id) {
            if (docsnap.data.exams[i].test[docsnap.data.exams[i].test.length-1] < 1 || docsnap.data.exams[i].submit == true) {
                alert("exam already submitted")
                docsnap.data.exams[i].submit = true
                await setDoc(doc(db, "Users", username), docsnap) 
            }
            else if(docsnap.data.exams[i].due < Date.now()){
                alert("exam is past due")
            }
            else{
            inexam = i
            time = docsnap.data.exams[inexam].test[docsnap.data.exams[inexam].test.length-1]
            tenth = time/10
            timerinit = setInterval(timer, 1000)
            }
        }
    }
}
async function finish(){
    clearInterval(timerinit)
    maxscore = docsnap.data.exams[inexam].test.length - 1
    score = maxscore
    for (let i = 0; i < docsnap.data.exams[inexam].test.length; i++) {
        if (!docsnap.data.exams[inexam].test[i].answeredas) {
            score--
        }
    }
    docsnap.data.exams[inexam].score = (score/maxscore) * 100
    docsnap.data.exams[inexam].submit = true
    await setDoc(doc(db, "Users", username), docsnap)
    inexam = ""
}
async function timer() {
    time--
    docsnap.data.exams[inexam].test[docsnap.data.exams[inexam].test.length-1] = time
    if (time == tenth && time > 20) {
        alert("time is running up")
    }
    if (time < 1) {
        alert("time is up! exam submitted")
        clearInterval(timerinit)
        inexam = ""
        docsnap.data.exams[inexam].submit = true
    }  
    await setDoc(doc(db, "Users", username), docsnap) 
}
async function show_score(id){
    for (let i = 0; i < docsnap.data.exams.length; i++) {
        if (docsnap.data.exams[i].id == id) {
            alert(docsnap.data.exams[i].score + "%")
        }
    }
}
async function soft_refresh(){
    refstr = "refreshing..."
    docsnap = await getDoc(doc(db, "Users", username))
    docsnap = docsnap.data()
    setTimeout(function(){refstr = "refreshed!"}, 700)
    setTimeout(function(){refstr = ""}, 1500)
}
</script>
<a href="../student/">Home</a>
{#if docsnap != ""}
{#if inexam === ""}
<div class="page">
    <div class="exams">
        <br><div class="secondary"><button on:click={soft_refresh}>Data refresh</button><button on:click={get_data}>Hard refresh</button></div><br>
        <p>{refstr}</p>
        <div class="data">
            <table style="border: solid 1px black;">
                <tr style="border: solid 1px black;">
                    <th style="border: solid 1px black;">name</th>
                    <th style="border: solid 1px black;">subject</th>
                    <th style="border: solid 1px black;">due</th>
                    <th style="border: solid 1px black;">additional notes</th>
                    <th style="border: solid 1px black;">status</th>
                </tr>
                {#each docsnap.data.exams as exam}
                    {#if exam.due > Date.now() || exam.submit}
                    <tr style="border: solid 1px black;"><td style="border: solid 1px black;">{exam.name}</td><td style="border: solid 1px black;">{exam.subject}</td>{#if parseFloat(new Date(exam.due).getMinutes()) < 10}<td style="border: solid 1px black;">{new Date(exam.due).getMonth() + "/" + new Date(exam.due).getDate() + "/" + new Date(exam.due).getFullYear() + ": " + new Date(exam.due).getHours() + ":0" + new Date(exam.due).getMinutes()}</td>{:else}<td style="border: solid 1px black;">{new Date(exam.due).getMonth() + "/" + new Date(exam.due).getDate() + "/" +new Date(exam.due).getFullYear() + ", " + new Date(exam.due).getHours() + ":" + new Date(exam.due).getMinutes()}</td>{/if}<td style="border: solid 1px black;">{exam.notes}</td><td style="border: solid 1px black;">{#if exam.submit} <p>Done <button class="grade" on:click={() => show_score(exam.id)}>score</button></p> {:else}<button on:click={() => start(exam.id)}>start</button>{/if}</td></tr>
                    {:else}
                    <tr style="border: solid 1px black;font-style: italic;text-align:center;"><td style="border: solid 1px black; ">{exam.name}</td><td style="border: solid 1px black;text-decoration:line-through;">{exam.subject}</td>{#if parseFloat(new Date(exam.due).getMinutes()) < 10}<td style="border: solid 1px black;text-decoration:underline;">{new Date(exam.due).getMonth() + "/" + new Date(exam.due).getDate() + "/" + new Date(exam.due).getFullYear() + ": " + new Date(exam.due).getHours() + ":0" + new Date(exam.due).getMinutes()}</td>{:else}<td style="border: solid 1px black;text-decoration:underline;">{new Date(exam.due).getMonth() + "/" + new Date(exam.due).getDate() + "/" +new Date(exam.due).getFullYear() + ", " + new Date(exam.due).getHours() + ":" + new Date(exam.due).getMinutes()}</td>{/if}<td style="border: solid 1px black;text-decoration:line-through;">{exam.notes}</td><td style="border: solid 1px black;">{#if exam.submit} <p>Done <button class="grade" on:click={() => show_score(exam.id)}>score</button></p> {:else}<p style="text-decoration:underline;">Missed</p>{/if}</td></tr>
                    {/if}               
                    {/each}
            </table>
        </div>
    </div>
</div>
{:else}
<div class="exampanel">
<div class="timer"><p class='time'>{time}</p></div>
{#each docsnap.data.exams[inexam].test as exam}
{#if exam.q}
<div class="question">
<p class="q">{exam.q}:</p><br>
<div class="answers"><button on:click={() => answer(exam.id, 0)}>{exam.o1}</button>{#if exam.o2} <button on:click={() => answer(exam.id, 1)}>{exam.o2}</button> {/if}{#if exam.o3} <button on:click={() => answer(exam.id, 2)}>{exam.o3}</button> {/if} {#if exam.o4} <button on:click={() => answer(exam.id, 3)}>{exam.o4}</button> {/if}    <br><p>{answerarr}</p></div>
</div><br>
{/if}
{/each}
<button on:click={finish}>finish</button>
</div>
{/if}
{:else}
{#if  browser&&localStorage.getItem('login_user')}
<p>loading...</p>
{:else}
<p>please <a href="../student/">sign in</a></p>
{/if}
{/if}
<style>
   .data{
    height: 80vh;
    width: 80vw;
    margin-left: 5vw;
    overflow: scroll;
    border:solid 1px black;
   }
   table{
    width: 80vw;
   }
   tr{
    height: 1vh;
   }
   td{
    height: 1vh;
   }
</style>