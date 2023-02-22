<script>
let docsnap, userRef, messages, messageRef, username, password, msg, dataRef, dataR, element, i, Id
messages = ""
docsnap = ""
msg = ""
import {browser} from '$app/environment'
import {doc, getDoc, setDoc} from 'firebase/firestore'
import { onMount, tick } from 'svelte';
import {db} from '../../env/firebase/db'
import jQuery from 'jquery'
const scrollToBottom = async (node) => {
    node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
  }; 
  onMount(() => 
  scroller()
  )
  function scroller(){
    clearInterval(i)
    if(messages != ""){
    scrollToBottom(element)
    }else{
    i = setInterval(scroller, 100)
    }
  }
username = browser && localStorage.getItem("login_user")
password = browser && localStorage.getItem("login_pass")
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
        get_messages()
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
async function get_messages(){
    messages = ""
    if(docsnap.ingroup){ 
        messageRef = doc(db, "Servers", docsnap.ingroup)
        messageRef = await getDoc(messageRef)
        messages = messageRef.data().messages
        asyncronize()
    }
}
async function asyncronize(){
    messageRef = doc(db, "Servers", docsnap.ingroup)
    messageRef = await getDoc(messageRef)
    messages = messageRef.data().messages
    asyncronize()
}
async function send(){
    if(msg.replace(" ", "")){
    dataRef = doc(db, "Servers", docsnap.ingroup)
    dataR = await getDoc(dataRef)
    dataR = dataR.data()
    dataR.messages.push({sender:username, content:msg, id:Math.random()})
    msg = ""
    await setDoc(dataRef, dataR)
    await tick()
    scrollToBottom(element)
    }
}
async function deleteMsg(msgId){
    dataRef = doc(db, "Servers", docsnap.ingroup)
    dataR = await getDoc(dataRef)
    dataR = dataR.data()
    Id = msgId
    for (let i = 0; i < dataR.messages.length; i++) {
        if (dataR.messages[i].id == Id){
          dataR.messages[i].content = "deleted" 
        }
    }
    dataR.messages = dataR.messages
    console.log(dataR, msgId)
    await setDoc(dataRef, dataR)
}
if(browser&&localStorage.getItem("login_user")){
get_data()
}
</script>
{#if docsnap != ""}
<div class="page">
    <div class="panel">
        <div class="messagebox">
            {#if messages != ""}<div class="messages" bind:this={element}>
                {#each messages as message}
                {#if message.sender != username}
                    <div class="message"><p>{message.sender}: {message.content}</p></div>
                {:else}
                <div class="message"><p>you: <i>{message.content}</i>{#if message.content != "deleted"}<button on:click={() => deleteMsg(message.id)}>delete</button>{/if}</p></div>
                {/if}
                {/each}
                <div class="send"><input type="text" class="sendinp" placeholder="send a message" bind:value={msg}><button on:click={send}>send</button></div>
            </div>
                {:else}
                {#if docsnap.ingroup}
                <p>loading...</p>
                {:else}
                <p>You dont have permission to access any groups. <a href="../../contact/admin/">Contact an admin</a></p>
                {/if}
            {/if}
        </div>
    </div>
</div>
{:else}
{#if  browser&&localStorage.getItem('login_user')}
<p>loading...</p>
{:else}
<p>please <a href="../student/">sign in</a></p>
{/if}
{/if}
<style>
    .send{
        position:absolute;
   bottom:0;
   height:60px;
   margin-left: 9vw;
    }
    .sendinp{
        width: 70vw;
    }
    .messages{
        width: 100vw;
        height: 90vh;
        overflow-y: scroll;
        border: solid 1px black;
    }
    ::-webkit-scrollbar {
            width: 6px;
        }
     
        /* Track */
        ::-webkit-scrollbar-track {
            background: gainsboro;
            border-radius: 5px;
        }
     
        /* Handle */
        ::-webkit-scrollbar-thumb {
            background: black;
            border-radius: 5px;
        }
     
        /* Handle on hover */
        ::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
    .messagebox{
        overflow: hidden;
        border: solid 1px black;
        margin-left: 0.75vw;
        height: 95vh;
    }
</style>