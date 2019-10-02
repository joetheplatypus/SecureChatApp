const socket = new io();
const chat = document.getElementById('chat');
const chatBox = document.getElementById('chatbox');
const chatBoxButton = document.getElementById('chatbox-submit');
const users = document.getElementById('users');
const loginName = document.getElementById('login-name');
const loginSubmit = document.getElementById('login-submit');
const loginError = document.getElementById('login-error');
const key = document.getElementById('key');
const imageSubmit = document.getElementById('image-submit');
const imageFile = document.getElementById('file');

socket.on('msg', (msg) => {
    const p = document.createElement('p');
    const text = document.createTextNode(`${msg.user}: ${decrypt(msg.text)}`);
    p.appendChild(text);
    chat.appendChild(p);
    scrollDown();
})

socket.on('img', (data) => {
    const img = document.createElement('img');
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';
    const p = document.createElement('p');
    const text = document.createTextNode(`${data.user}:`);
    p.appendChild(text);
    chat.appendChild(p);
    chat.appendChild(img)
    scrollDown();
    img.src = decrypt(data.src);
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
        socket.emit('addmsg', emsg);
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
    //console.log(`encrypting ${msg} with ${key.value}`)
    const cipher = CryptoJS.AES.encrypt(msg, key.value).toString()
    return cipher
}

function decrypt(msg) {
    //console.log(`decrypting ${msg} with ${key.value}`)
    try {
        return CryptoJS.AES.decrypt(msg, key.value).toString(CryptoJS.enc.Utf8)
    } catch(e) {
        console.log('unable to decrypt image')
        return null;
    }
}

imageSubmit.onclick = () => {
    const imageData = file.files[0];
    const reader = new FileReader();
    const image = new Image();
    
    reader.onload = (e) => {
        image.src = e.target.result;
        socket.emit('addimg', encrypt(image.src));
    }
    reader.readAsDataURL(imageData);
    closeImageModal();
}
