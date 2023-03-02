<script>
   let server, uriid, uploaded, data, username, password, studentlist, pressed, userRef, docsnap, l, msg, anotes, fname;
   msg = ""
   anotes = ""
   fname = ''
   import {browser} from '$app/environment';
   import {db} from '../../env/firebase/db'
   import {doc, getDoc, setDoc} from 'firebase/firestore'
   username = browser&&localStorage.getItem("teacher_user")
password = browser&&localStorage.getItem("teacher_pass")
studentlist = []
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
if(browser&&localStorage.getItem("teacher_user")){
   get_fastest_server()
    get_data()
}
function get_fastest_server(){
   fetch('https://api.gofile.io/getServer')
  .then(response => response.json())
  .then(data => {
    if (data.status === 'ok') {
 server = data.data.server    
    }
  })
  .catch(error => console.error(error))
}             
   async function upload_to_api(file){
      const formData = new FormData();
formData.append('file', file);
fetch(`https://${server}.gofile.io/uploadFile`, {
    method: 'POST',
    body: formData,
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'ok') {
      uriid = data.data.code
      alert("file uploaded successfully")
      uploaded = true;
    }
  })
  .catch(error => console.error(error))
   }
   function uploadf(){
      if (fname.replace(" ", "") == "") fname = "unnamed"
   upload_to_api(document.getElementById("file").files[0])
   }
   function add_student(student){
      if(!studentlist.includes(student)){
studentlist.push(student)
      }else{
         studentlist = studentlist.filter(function(v) {return v !== student;});
      }
      studentlist = studentlist
   }
   async function upload() {
      for (let i = 0; i < studentlist.length; i++) {
            l = await getDoc(doc(db, "Users", studentlist[i]))
            l = l.data()
            l.material.push({uri: uriid, date: Date.now(), notes:anotes, name:fname, uploader:data.linked_data.username})
            await setDoc(doc(db, "Users", studentlist[i]), l)
      }
      data.material.push({uri: uriid, date: Date.now(), notes:anotes, name:fname})
      await setDoc(doc(db, "Teachers", username), data)
      uploaded = false
      msg = "file uploaded successfully"
   }
</script>
{#if browser&&localStorage.getItem("teacher_user")}
{#if pressed}
<p>loading..</p>
{:else}
{#if data}
{#if uploaded}
<p>select students</p>
{#each data.students as student}
<p>{student.name}</p><input type="checkbox" on:click={() => add_student(student.name)}>
{/each}
<button on:click={upload}>upload</button>
{:else}
<input type="file" id="file"><br><input type="text" placeholder="name" bind:value={fname}><br><input type="text" placeholder="additional notes" bind:value={anotes}><br><button on:click={uploadf}>upload</button><br><p>{msg}</p><br>
<p>uploaded files:</p><br>
<table>
   <tr>
   <th>Name</th>
   <th>Published</th>
   <th>Additional notes</th>
   <th>Download</th>
   </tr>
   {#if data.material.length > 0}
{#each data.material as material}
   <tr>
      <td>{material.name}</td>
      <td>{"0" + new Date(material.date).getDay() + "/" + new Date(material.date).getMonth() + "/" + new Date(material.date).getFullYear()}</td>
      <td>{material.notes}</td>
      <td><a href={`https://gofile.io/d/${material.uri}`}>download</a></td>
   </tr>
{/each}
{:else}
<tr><td>no data</td></tr>
{/if}
</table>
{/if}
{/if}
{/if}
{:else}
<p>please <a href="../">sign in</a></p>
{/if}
<style>
   th, table, tr{
      border: solid 1px black;
   }
</style>