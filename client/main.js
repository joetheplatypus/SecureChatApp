const socket = new io();
const chat = document.getElementById('chat');
const chatBox = document.getElementById('chatbox');
const chatBoxButton = document.getElementById('chatbox-submit');
const users = document.getElementById('users');
const loginName = document.getElementById('login-name');
const loginSubmit = document.getElementById('login-submit');
const loginError = document.getElementById('login-error');
const key = document.getElementById('key');

socket.on('msg', (msg) => {
    const p = document.createElement('p');
    const text = document.createTextNode(`${msg.user}: ${decrypt(msg.text)}`);
    p.appendChild(text);
    chat.appendChild(p);
    scrollDown();
})

socket.on('broadcast', (msg) => {
    const p = document.createElement('p');
    const text = document.createTextNode(msg);
    p.style.color = 'red'
    p.appendChild(text);
    chat.appendChild(p);
})

socket.on('allusers', (msg) => {
    users.innerHTML = '<i>Users: </i>';
    msg.map(user => {
        const p = document.createElement('p');
        const text = document.createTextNode(user);
        p.appendChild(text);
        users.appendChild(p);
    })  
})

chatBoxButton.onclick = () => {
    const msg = chatBox.value;
    if(msg !== '') {
        chatBox.value = '';
        const emsg = encrypt(msg);
        console.log(emsg.toString())
        socket.emit('addmsg', emsg.toString());
    }
}

window.onkeydown = (e) => {
    if(e.key === 'Enter') {
        chatBoxButton.onclick();
    }
}

function scrollDown() {
    chat.scrollTop = chat.scrollHeight;
}

loginSubmit.onclick = () => {
    const name = loginName.value;
    if(name !== '') {
        socket.emit('reqname', name);
    }
}

socket.on('nametaken', (name)=> {
    loginError.innerText = `The name '${name}' is already taken`;
})

socket.on('loginsuccess', (name)=> {
    closeModal();
})

function encrypt(msg) {
    console.log(`encrypting ${msg} with ${key.value}`)
    return CryptoJS.AES.encrypt(msg, key.value)
}

function decrypt(msg) {
    console.log(`decrypting ${msg} with ${key.value}`)
    return CryptoJS.AES.decrypt(msg, key.value).toString(CryptoJS.enc.Utf8)
}

