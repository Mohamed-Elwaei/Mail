
document.addEventListener('DOMContentLoaded', function() {
  
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_sent('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_archive());
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});
////
function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.getElementById('view-email').style.display='none';
  document.getElementById('reply-email').style.display='none';


  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.getElementById('view-email').style.display='none';
  document.getElementById('reply-email').style.display='none';
  
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  let div = document.createElement('div');
  div.className='list-group';
  document.getElementById('emails-view').appendChild(div);
  


 fetch('/emails/' + mailbox)
 .then(response => response.json())
 .then(data=> data.forEach(element => {
  let a = document.createElement('div');
  a.className = 'list-group-item list-group-item-action active';
  a.ariaCurrent='true';
  a.innerHTML = `
  <div class="d-flex w-100 justify-content-between">
    <h5 class="mb-1">From ${element.sender}</h5>
    <small>${element.timestamp}</small>
  </div>
  <p class="mb-1">Subject: ${element.subject}</p>
  
  <br>
  <button type="button" class="btn btn-light" value='${element.id}' onclick='archive(${element.id})'>Archive</button>
  <button type="button" class="btn btn-success" value='${element.id}' onclick='view(${element.id})'>View</button>

`;
div.appendChild(a);
  console.log(element.id);
 }))

  
}


 function sendEmail(){
  
    let recepients = document.querySelector('#compose-recipients').value;
    let subject = document.querySelector('#compose-subject').value;
    let body = document.querySelector('#compose-body').value;

    event.preventDefault()

    fetch('/emails', {
          method: 'POST',
          body: JSON.stringify({
              recipients: `${recepients}`,
              subject: `${subject}`,
              body:  `${body}`,
          })
        })
        .then(response => response.json())
        .then(result => {
            // Print result
            console.log(result);
        });
        
        document.innerHTML=`<script src="//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js">toastr.success("Message sent successfully")</script>`
        compose_email();
  }
function archive(id){
   
    
    fetch(`/emails/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: true
      })
    })
    
    
    
  }
function unarchive(id){
    
    fetch(`/emails/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: false
      })
    })}

function load_archive(){
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#reply-email').style.display = 'none'; 
  document.getElementById('view-email').style.display='none';

  // Show the mailbox name
  let mailbox = 'archive'
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  let div = document.createElement('div');
  div.className='list-group';
  document.getElementById('emails-view').appendChild(div);

 fetch('/emails/archive')
 .then(response => response.json())
 .then(data=> data.forEach(element => {


    
    let a = document.createElement('div');
    a.className = 'list-group-item list-group-item-action active';
    a.ariaCurrent='true';
    a.innerHTML = `
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">From ${element.sender}</h5>
      <small>${element.timestamp}</small>
    </div>
    <p class="mb-1">Subject: ${element.subject}</p>
    
    <br>
    <button type="button" class="btn btn-danger" value='${element.id}' onclick='unarchive(${element.id})'>Remove from archive</button>
    <button type="button" class="btn btn-success" value='${element.id}' onclick='view(${element.id})'>View</button>

  
  `;
  div.appendChild(a);
    console.log(element.id);
  
 }))
}    
function load_sent(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#reply-email').style.display = 'none'; 
  document.getElementById('view-email').style.display='none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  let div = document.createElement('div');
  div.className='list-group';
  document.getElementById('emails-view').appendChild(div);
  


 fetch('/emails/' + mailbox)
 .then(response => response.json())
 .then(data=> data.forEach(element => {
  let a = document.createElement('div');
  a.className = 'list-group-item list-group-item-action active';
  a.ariaCurrent='true';
  a.innerHTML = `
  <div class="d-flex w-100 justify-content-between">
    <h5 class="mb-1">From ${element.sender}</h5>
    <small>${element.timestamp}</small>
  </div>
  <p class="mb-1">Subject: ${element.subject}</p>
  <button type="button" class="btn btn-success" value='${element.id}' onclick='view(${element.id})'>View</button>

  

`;
div.appendChild(a);
  console.log(element.id);
 }))

  
}
function view(id){
event.preventDefault()  
document.querySelector('#emails-view').style.display = 'none';
document.querySelector('#compose-view').style.display = 'none'; 
document.querySelector('#reply-email').style.display = 'none'; 
document.getElementById('view-email').style.display='block';

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
      // Print email
      if(document.getElementById('sender').value!=document.getElementById('main-user').innerText)
      {
        document.getElementById('view-email').innerHTML=`        <h3>${email.subject}</h3>
        <div class="form-group">
            From: <input disabled id="sender" class="form-control" value="${email.sender}">
            </div>
            <div class="form-group">
            Sent on: <input disabled id="sender" class="form-control" value="${email.timestamp}">
            </div>
        
    
        <textarea class="form-control" disabled id="compose-body" placeholder="">${email.body}</textarea>
        <button onclick="reply(${email.id})" class="btn btn-primary">Create a Reply</button>
    `
      }
      else{
        document.getElementById('view-email').innerHTML=`        <h3>${email.subject}</h3>
        <div class="form-group">
            From: <input disabled id="sender" class="form-control" value="${email.sender}">
            </div>
            <div class="form-group">
            Sent on: <input disabled id="sender" class="form-control" value="${email.timestamp}">
            </div>
        
    
        <textarea class="form-control" disabled id="compose-body" placeholder="">${email.body}</textarea>
        <button onclick="load_mailbox(inbox)" class="btn btn-primary">Back to inbox</button>
    `
      }
  
      // ... do something else with email ...
  });
}


function reply(id){
  
event.preventDefault()  
document.querySelector('#emails-view').style.display = 'none';
document.querySelector('#compose-view').style.display = 'none'; 
document.querySelector('#view-email').style.display = 'none'; 
document.getElementById('reply-email').style.display='block';



fetch(`/emails/${id}`)
.then(response => response.json())
.then(email => {
    // Print email
    console.log(email);
    console.log(email.id);
    console.log(email.subject);
    document.getElementById('reply-email').innerHTML=` 
    
    <div class="form-group">
        Subject: <input  id="reply-subject" class="form-control" value="Re:${email.subject}">
        </div>
    <div class="form-group">
        To: <input disabled id="reply-recipient" class="form-control" value="${email.sender}">
        </div>
        <div class="form-group">
        Sent on: <input disabled id="reply-timestamp" class="form-control" value="${email.timestamp}">
        </div>
    

    <textarea class="form-control"  id="reply-body" placeholder=""></textarea>
    <button onclick="sendReply()" class="btn btn-primary">Reply</button>
`
// ... do something else with email ...
})

}
function sendReply(){

  let replySubject=document.getElementById('reply-subject').value;
  let replyRecipient=document.getElementById('reply-recipient').value;
  let replyTimestamp=document.getElementById('reply-timestamp').value;
  let replyBody=document.getElementById('reply-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: `${replyRecipient}`,
        subject: `${replySubject}`,
        body:  `${replyBody}`,
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
  });
  
  compose_email();

}