<script>
let docsnap, userRef, messages, username, password, msg, element, i, Id, group, groupRef, groupDoc
messages = ""
docsnap = ""
msg = ""
group = ""
import {browser} from '$app/environment'
import {doc, getDoc, setDoc} from 'firebase/firestore'
import { onMount, tick } from 'svelte';
import {db} from '../../env/firebase/db'
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
    groupDoc = doc(db, "Servers", groupRef)
    group = await getDoc(groupDoc)
    asyncronize()
}
async function asyncronize(){
    if(group != ""){
    group = await getDoc(groupDoc)
    group = group.data()
    messages = group.messages
    setTimeout(asyncronize, 500)
    }
}
async function send(){
    if(msg.replace(" ", "")){
    group.messages.push({sender:username, content:msg, id:Math.random()})
    msg = ""
    await setDoc(groupDoc, group)
    await tick()
    scrollToBottom(element)
    }
}
async function deleteMsg(msgId){
    Id = msgId
    for (let i = 0; i < group.messages.length; i++) {
        if (group.messages[i].id == Id){
          group.messages[i].content = "deleted" 
        }
    }
    group = group
    await setDoc(groupDoc, group)
}
function join(group_name){
groupRef = group_name
get_messages()
console.log(groupRef)
}
function back(){
    group = ""
}
if(browser&&localStorage.getItem("login_user")){
get_data()
}
</script>
{#if docsnap != ""}
<div class="page">
    <div class="panel">{#if group != ""}
        <button on:click={back} class="back">Back</button><br>
        {/if}
        <div class="messagebox">
            {#if group != ""}<div class="messages" bind:this={element}>
                {#each messages as message}
                {#if message.content != "deleted"}
                {#if message.sender != username}
                    <div class="message"><p>{message.sender}: {message.content}</p></div>
                {:else}
                <div class="message"><p>you: <i>{message.content}</i>{#if message.content != "deleted"}<button on:click={() => deleteMsg(message.id)}>delete</button>{/if}</p></div>
                {/if}
                {/if}
                {/each}
                <div class="send">{#if docsnap.sendperms.includes(group)}<form on:submit|preventDefault={() => send()}><input type="text" class="sendinp" placeholder="send a message" bind:value={msg}><button on:click={send}>send</button></form>{:else} <p>you are not allowed to send messages in this channel. to <a href="../../contact">contact a teacher or admin</a></p>{/if}</div>
        </div>
                {:else}
                {#if docsnap.ingroup && docsnap.ingroup.length > 0}
                <div class="groups">
                {#each docsnap.ingroup as groupname}
                <div class="group"><button on:click={() => join(groupname)} class="groupbut">{groupname}</button></div>
                {/each}
                </div>
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
   display: flex;
   align-items: center;
   justify-content: center;
   margin-left: 22.5vw;
    }
    .sendinp{
        width: 50vw;
        text-align: center;
    }
    .messages{
        width: 100vw;
        height: 90vh;
        overflow-y: scroll;
        border: solid 1px black;
        text-align: center;
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
        border-radius: 1%;
    }
    .group{
     border: solid 1px black;
    }
    .groupbut{
        background-color: white;
        border: none;
        width: 5vw;
    }
    .back{
        width: 92vw;
        margin-left: 1vw;
        text-align: center;
        border-radius: 2%;
    }
</style>