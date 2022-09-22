document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

}

function send_email(event) {
  event.preventDefault()

  fetch('/emails', {
    method: 'POST',
    // mode: "no-cors",
    body: JSON.stringify({
      recipients: document.querySelector('#compose-recipients').value,
      subject: document.querySelector('#compose-subject').value,
      body: document.querySelector('#compose-body').value
    })
  })
    .then(response => response.json())
    .then(result => {
      console.log(result);
    });
}


function load_mailbox(mailbox) {
  // fetch request to get emails
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      // console.log(emails)
      emails.forEach(display_inbox);
    });

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-indv-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
}

function display_inbox(contents) {
  const post = document.createElement('div');
  post.className = 'email-entry';
  post.innerHTML = '<ul class="list-group list-group-horizontal border border-dark rounded-0">'
    + '<li class="list-group-item col-3 border-0 font-weight-bold  text-left">' + contents.sender
    + '</li><li class="list-group-item col-6 border-0">' + contents.subject
    + '</li><li class="list-group-item col-3 border-0 text-right">' + contents.timestamp
    + '</li></ul>';
  post.addEventListener('click', () => open_email(contents.id));
  document.querySelector('#emails-view').append(post)
}

function open_email(email_id) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-indv-view').style.display = 'block';

  fetch(`/emails/${email_id}`)
    .then(response => response.json())
    .then(email => {
      console.log(email)
      document.querySelector('#email-indv-view').innerHTML = `<p><span class="font-weight-bold">From: </span>${email.subject}</p>
      <p><span class="font-weight-bold">To: </span>${email.recipients}</p>
      <p><span class="font-weight-bold">Subject: </span>${email.subject}</p>
      <p><span class="font-weight-bold">Timestamp: </span>${email.timestamp}</p>
      <hr><p>${email.body}</p>
      `;
    });
}