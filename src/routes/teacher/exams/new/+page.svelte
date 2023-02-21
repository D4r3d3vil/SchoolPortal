<script>
    let docsnap, data, username, password, userRef, pressed, question, option, questions, optionlist, finished, adds, added, students, studentRef, writabledata, text, href1, text2, ename, duee, correctnum, anotes, m, y, due, studentData, time;
    text = ""
    text2 = ""
    href1 = ""
    correctnum = ""
questions =[] 
optionlist =[] 
added =[]
students = []
writabledata = []
question = ""
option = ""
console.log(questions)
import {browser} from '$app/environment'
import {doc, getDoc, setDoc} from 'firebase/firestore'
import {db} from '../../../env/firebase/db'
username = browser && localStorage.getItem("teacher_user")
password = browser && localStorage.getItem("teacher_pass")
if(browser && localStorage.getItem("teacher_user")){
    pressed = true
    get_data()
}
async function get_data(){
    userRef = doc(db, "Teachers", username);
    userRef = await getDoc(userRef)
    if(userRef.data() == undefined){
        pressed = false
        return alert("inexistent user")
    }
    docsnap = userRef.data()
    if(docsnap.password == password){
        data = docsnap  
        students = data.students
        console.log(students)
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
setTimeout(function(){text = "please "; text2 = "sign in"; href1 = "./teacher"}, 5000)
function add_option(){
if(option.replace(" ", "") != "" && !optionlist.includes(option)){
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
if(correctnum == "") return alert("please specify the correct answer")
questions.push({qtext: question, options:optionlist, correct:correctnum})
console.log(questions)
optionlist = []
questions= questions
correctnum = ""
question = ""
}
async function finish(){
    finished = true
}
function add_student(student_name){
let not = true
for (let i = 0; i < added.length; i++) {
   if (added[i].name == student_name) {
    added[i] = 0
    not = false
   }
}
if (not) {
    added.push({name:student_name})
}
added = added
}
function dbparse() {
    writabledata = {id:Math.random(), name:ename, notes: anotes, test:[], due:due, submit:false, subject:data.subject}
    for (let i = 0; i < questions.length; i++) {
        if (questions[i].options.length == 2) {
            writabledata.test.push({id:Math.random(), ans:parseInt(questions[i].correct), answeredas:false, o1:questions[i].options[0], o2:questions[i].options[1], q:questions[i].qtext})              
        } 
        else if (questions[i].options.length == 3) {
            writabledata.test.push({id:Math.random(), ans:parseInt(questions[i].correct), answeredas:false, o1:questions[i].options[0], o2:questions[i].options[1],o3:questions[i].options[2], q:questions[i].qtext})              
        }else{
            writabledata.test.push({id:Math.random(), ans:parseInt(questions[i].correct), answeredas:false, o1:questions[i].options[0], o2:questions[i].options[1],o3:questions[i].options[2],o4:questions[i].options[3], q:questions[i].qtext})              
        }
    }
    writabledata.test.push(parseInt(time))
}
async function upload(){
    dbparse()
    console.log(added)
    for (let i = 0; i < added.length; i++) {
        if(added[i]!=0){
        studentRef = doc(db, "Users", added[i].name)
        studentData = await getDoc(studentRef)
        studentData = studentData.data() 
        studentData.data.exams.push(writabledata)
        console.log(studentData)
        await setDoc(studentRef, studentData)   
        }
    }
    finished = false
}
function prepareDate(d) {
  [m, d, y] = d.split("-"); //Split the string
  console.log(Date.now())
  return [m,d -1,y]
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
<p>due date: </p><input type="date" placeholder="date" bind:value={duee} on:change={function(){due = ((new Date(...prepareDate(duee)).getTime()))}}><br><p>name: </p><input type="text" placeholder="name" bind:value={ename}><p>additional notes</p><input type="text" bind:value={anotes} placeholder="example: practical exam"><br><input type="text" bind:value={time} placeholder="time">
<button on:click={upload}>Upload exam</button>
{:else}
{#if data == undefined}
{#if pressed}
<br>
<p class="logging">loading...</p>
{:else}
<p>{text}<a href={href1}>{text2}</a></p>
{/if}
{:else}
<div class="preview">
<h3>Preview (what student sees):</h3><br>
{#each questions as q}
<h4>question: {q.qtext}</h4>
{#each q.options as option}
<button class="op">{option}</button>
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
<button class="op">{option}</button><br><br>
{/each}
<p>Number of correct answer</p><input type="text" placeholder="example: 4" bind:value={correctnum}>
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