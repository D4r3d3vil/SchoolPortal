<script>
let newuser, newpass, studentsRef, groups, student, studentsgot, studentsDoc, students;
studentsgot = false
import {browser} from '$app/environment'
import {db} from '../../env/firebase/db'
import { deleteDoc, getDoc, setDoc, doc } from 'firebase/firestore';
async function create(){
await setDoc(doc(db, "Users", newuser), {data:{exams:{}, inbox:{}}, linked_data:{passwd:newpass}})
}
async function getStudents(){
    students = []
    studentsDoc = await getDoc(doc(db, "Users", "existing"))
    studentsDoc = studentsDoc.data().students
    for (let i = 0; i < studentsDoc.length; i++) {
        studentsRef = await getDoc(doc(db, "Users", studentsDoc[i]))
        studentsRef = studentsRef.data()
        students.push(studentsRef)
    }
    studentsgot = true
}
async function getGroups(){
    groups = await getDoc(doc(db, "Servers", "existing"))
    groups = groups.data().groups.reverse()
}
async function delete_student(stdnt){
    deleteDoc(doc(db, "Users", stdnt))
}
async function remove_add_group_from_student(stdt, grp){
    console.log(stdt, grp)
    student = doc(db, "Users", stdt)
    student = await getDoc(student)
    student = student.data()
    if(student.ingroup && student.ingroup.includes(grp)){
        student.ingroup = student.ingroup.filter(function(v) {return v !== grp;});
    }else{
        if(student.ingroup){
        student.ingroup.push(grp)
        }else{
        student.ingroup = [grp]
        }
    }
    await setDoc(doc(db, "Users", stdt), student)
    }
if(browser&&localStorage.getItem("admin_user")){getGroups();getStudents()}
</script>
{#if studentsgot}
<button>add</button>
<br>
{#each students as student}
<p>{student.name}</p><button on:click={() => delete_student(student)}>delete</button>
<br>
{#each groups as group}
<p>access to groups: </p>
<br>
<p>{group}</p>
{#if student.ingroup.includes(group)}
<input type="checkbox" on:click={() => remove_add_group_from_student(student.name, group)} checked>
{:else}
<input type="checkbox" on:click={() => remove_add_group_from_student(student.name, group)}>
{/if}    
{/each}
{/each}
{/if}

