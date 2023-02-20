<script>
    let docsnap, data, username, password, userRef, pressed, question, option, questions, optionlist, finished, adds, added, students, studentRef, writabledata;
questions =[] 
optionlist =[] 
added =[]
students = []
question, option = ""
console.log(questions)
import {browser} from '$app/environment'
import {doc, getDoc, setDoc} from 'firebase/firestore'
import {db} from '../../../env/firebase/db'
username = browser && localStorage.getItem("teacher_user")
password = browser && localStorage.getItem("teacher_pass")
Array.prototype.remove = function(value, ary) {
    return ary.filter(function(v) {
        return v != value;
    });
}
if(browser && localStorage.getItem("teacher_user")){
    get_data()
}
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
function add_option(){
if(option.replace(" ", "") != ""){
if (optionlist.length < 4) {
    optionlist.push(option)
    optionlist = optionlist
    option = ""
}else{
    alert("max amount of options for a question is 4")
}
}
}
function add_question(){
if (optionlist.length<2) return alert("you must add at least 2 options") 
questions.push({qtext: question, options:optionlist})
console.log(questions)
optionlist = []
questions= questions
}
async function finish(){
    finished = true
}
function add_student(student_name){
if (added.includes(student_name)) {
    added = added.remove(student_name, added)
}else{
    added = added.push(student_name)
}
}
function dbparse() {
    for (let i = 0; i < questions.length; i++) {
      writabledata.push({})
    }
}
async function upload(){
    writabledata = []
    dbparse()
    for (let i = 0; i < added.length; i++) {
        studentRef = doc(db, "Users", added[i])
        studentData = await getDoc(studentRef)
        studentData = studentData.data()    
    }
}
</script>
{#if finished}
{#each students as student}
<div class="student">
    <p>{student.name}</p>
    <input type="checkbox" name="check" on:click={() => add_student(student.name)}>
</div>    
{/each}
<br>
<button on:click={upload}>Upload exam</button>
{:else}
{#if data == undefined}
<p>please <a href="./teacher">sign in</a></p>
{#if pressed}
<br>
<p class="logging">loading...</p>
{/if}
{:else}
<div class="preview">
<h3>Preview (what student sees):</h3><br>
{#each questions as q}
<h4>question: {q.qtext}</h4>
{#each q.options as option}
<button class="op">{option}</button><br><br>
{/each}
{/each}
</div>
<br>
<div class="panel">
    <div class="exam"><input type="text" name="q" bind:value={question} placeholder="add question"><br><br><input type="text" bind:value={option} placeholder="add option"><button on:click={add_option}>add</button></div>
</div><br>
<h4>question will look like this: </h4><br>
<h4>{question}:</h4>
<br>
{#each optionlist as option}
<button class="op">{option}</button>
{/each}
<br>
<button on:click={add_question}>add question</button>
<br><br><br>
<button on:click={finish}>finish/submit</button>
{/if}
{/if}
<style>
    .op{
        margin-left: 20vw;
        width: fit-content;
    }
    .preview{
        border: solid 1px black;
    }
</style>