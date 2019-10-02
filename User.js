class User {
    constructor(name,socket) {
        this.id = socket.id;
        this.name = name;
        this.socket = socket;
        User.list.push(this);

        User.broadcast(`${this.name} joined the chat`);
        User.sendUsers();
        
        this.socket.on('addmsg', (msg) => {
            User.sendToAll(msg,this);
        })
        this.socket.on('addimg', (data) => {
            User.sendImgToAll(data, this);
        })
        this.socket.on('disconnect', () => {
            User.broadcast(`${this.name} left the chat`);
            User.list.splice(User.list.indexOf(this),1);
            User.sendUsers();
        })
    }
    static broadcast(msg) {
        User.list.map(user => {
            user.socket.emit('broadcast', msg)
        })
    }
    static sendToAll(msg, sender) {
        User.list.map(user => {
            user.socket.emit('msg', {user:sender.name,text:msg})
        })
    }
    static sendImgToAll(data, sender) {
        User.list.map(user => {
            user.socket.emit('img', {user:sender.name,src:data})
        })
    }
    static sendUsers() {
        User.list.map(user => {
            user.socket.emit('allusers', User.list.map(user => user.name))
        })
    }
    static nameTaken(name) {
        const user = User.list.find(user => user.name == name);
        if(user) {
            return true;
        }
        return false;
    }
}
User.list = [];
module.exports = User;