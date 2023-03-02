<script>
       let data, username, password, studentlist, pressed, userRef, docsnap;
import {browser} from '$app/environment';
   import {db} from '../../env/firebase/db'
   import {doc, getDoc, setDoc} from 'firebase/firestore'
   username = browser&&localStorage.getItem("login_user")
password = browser&&localStorage.getItem("login_pass")
studentlist = []
async function get_data(){
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
        pressed = false
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
if(browser&&localStorage.getItem("login_user")){
    get_data()
}
function openurl(url) {
    window.open(url, '_blank').focus();    
}
</script>
{#if browser&&localStorage.getItem("teacher_user")}
{#if pressed}
<p>loading..</p>
{:else}
{#if data}

<p>select students</p>
<p>uploaded files:</p><br>
<table>
   <tr>
   <th>Name</th>
   <th>Uploaded by</th>
   <th>Published</th>
   <th>Additional notes</th>
   <th>Download</th>
   </tr>
   {#if data.material.length > 0}
{#each data.material as material}
   <tr>
      <td>{material.name}</td>
      <td>{material.uploader}</td>
      <td>{"0" + new Date(material.date).getDay() + "/" + new Date(material.date).getMonth() + "/" + new Date(material.date).getFullYear()}</td>
      <td>{material.notes}</td>
      <td><a href="" on:click={() => openurl(`https://gofile.io/d/${material.uri}`)}>view</a></td>
   </tr>
{/each}
{:else}
<tr><p>no data</p></tr>
{/if}
</table>
{/if}
{/if}
{/if}
<style>
    tr, th, table, td{
        border: solid 1px black;
    }
</style>