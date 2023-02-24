<script>
    let files, username, password, pressed, userRef, data, docsnap, reader, notes
    files = ""
    import {browser} from '$app/environment'
    import {db} from '../../env/firebase/db'
    import {doc, setDoc, getDoc} from 'firebase/firestore'
    async function upload(){
    if (files[0] != "" && files[0]) {
    reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = async function () {
        if(typeof(reader.result) === Blob) reader.result.replace(/^data:.+;base64,/, '');
        console.log("encoded")
        console.log(reader.result)
        data.material.push({file:reader.result, notes:notes, uploaddate: Date.now(), name:files[0].name})
        await setDoc(doc(db, "Teachers", username), data) 
        docsnap = await getDoc(doc(db, "Teachers", username))
        data = docsnap.data()
        data.material = data.material
    };
    reader.onerror = function (error) {
      alert("Error please contact a developer (0546879924)")
      console.log("Error: ", error)
    };
    }
    }
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
        browser && localStorage.setItem("teacher_user", username)
        browser && localStorage.setItem("teacher_pass", password)        
    }else{
        if(docsnap.passchange != undefined && docsnap.passlist.includes(password)){
            pressed = false
            alert("password was changed " + new Date(docsnap.passchange))
        }else{
            pressed = false
        alert("incorrect password")
        }
    }
}
</script>
{#if data == undefined}
{#if pressed}
<br>
<p class="logging">loading...</p>
{:else}
<p>please <a href="../">sign in</a></p>
{/if}
{:else}
<h2>Upload files:</h2><br>
<input type="file" bind:files={files}><br><br>
<input type="text" placeholder="Additional Notes" bind:value={notes}>
<br>
<br>
<button on:click={upload}>Upload</button>
<table>
    <tr>
        <th>filename</th>
        <th>notes</th>
        <th>upload date</th>
        <th>download</th>
    </tr>
    {#each data.material as material}
    <tr>
        <td>{material.name}</td>
        <td>{material.notes}</td>
        <td>{new Date(material.uploaddate).getDate() + "/" + new Date(material.uploaddate).getMonth() + "/" + new Date(material.uploaddate).getFullYear()}</td>
        <td>download</td>
    </tr>
    {/each}
</table>
{/if}