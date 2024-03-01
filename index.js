const axios = require("axios")
const dotenv = require("dotenv");

dotenv.config()
const messagesOnTime = [
    //{time: {h: 0, m: 11}, content: "nie no tyle to nie", sent: false},
    {time: {h: 20, m: 37}, content: "__papiez2137__", sent: false},
]

const global = {
    user_id: process.env.USER_ID,
    auth: process.env.AUTH,
    channel_id: process.env.CHANNEL_ID
}
 


const shortAnswerKeywords = {
    "są rzeczy niezmienne": {type: "img", msg: "https://pbs.twimg.com/media/F5cgPkzWYAAjagg.jpg", del: true},
    "nie no tyle to nie": {type:"img", msg: "https://i.pinimg.com/474x/8f/2d/52/8f2d52cc57f2b8919914db6d0873d002.jpg", del: true},
    "niesamowita sprawa, dziwne nie?": {type: "img", msg: "https://media.tenor.com/Q_t8umPvvMUAAAAe/niesamowita-sprawa.png", del: true},
    "wasza wysokość jest zbyt łaskawa": {type: "img", msg: "https://i1.jbzd.com.pl/contents/2023/07/normal/QCNJeL7dujM4eZAGVjWSEQzP5lybxvwr.png", del: true},
    
    "Moim zdaniem to nie ma tak, że dobrze albo że nie dobrze": {type: "text", msg: "Gdybym miał powiedzieć, co cenię w życiu najbardziej, powiedziałbym, że ludzi. Ekhm… Ludzi, którzy podali mi pomocną dłoń, kiedy sobie nie radziłem, kiedy byłem sam. I co ciekawe, to właśnie przypadkowe spotkania wpływają na nasze życie. Chodzi o to, że kiedy wyznaje się pewne wartości, nawet pozornie uniwersalne, bywa, że nie znajduje się zrozumienia, które by tak rzec, które pomaga się nam rozwijać. Ja miałem szczęście, by tak rzec, ponieważ je znalazłem. I dziękuję życiu. Dziękuję mu, życie to śpiew, życie to taniec, życie to miłość. Wielu ludzi pyta mnie o to samo, ale jak ty to robisz? Skąd czerpiesz tę radość? A ja odpowiadam, że to proste, to umiłowanie życia, to właśnie ono sprawia, że dzisiaj na przykład buduję maszyny, a jutro… kto wie, dlaczego by nie, oddam się pracy społecznej i będę ot, choćby sadzić… znaczy… marchew.", del: false},
    "Gdybym miał powiedzieć, co cenię w życiu najbardziej, powiedziałbym, że ludzi. Ekhm… Ludzi, którzy podali mi pomocną dłoń, kiedy sobie nie radziłem, kiedy byłem sam. I co ciekawe, to właśnie przypadkowe spotkania wpływają na nasze życie. Chodzi o to, że kiedy wyznaje się pewne wartości, nawet pozornie uniwersalne, bywa, że nie znajduje się zrozumienia, które by tak rzec, które pomaga się nam rozwijać. Ja miałem szczęście, by tak rzec, ponieważ je znalazłem. I dziękuję życiu. Dziękuję mu, życie to śpiew, życie to taniec, życie to miłość. Wielu ludzi pyta mnie o to samo, ale jak ty to robisz? Skąd czerpiesz tę radość? A ja odpowiadam, że to proste, to umiłowanie życia, to właśnie ono sprawia, że dzisiaj na przykład buduję maszyny, a jutro… kto wie, dlaczego by nie, oddam się pracy społecznej i będę ot, choćby sadzić… znaczy… marchew.": {type: "img", msg: "https://wykop.pl/cdn/c3201142/comment_PgJ0GJwjF5VXWjaaxu0TiQACg2ZvgfV5,w400.jpg", del: false},

    "__papiez2137__": {type: "img", msg: "https://cdn.hejto.pl/uploads/posts/images/1200x900/2f0108ca8c6ff0b2e33e76b3a8e71675.gif", del: false}
}


const delMessageById = async (id) => {
    headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': global.auth
    }
    try {
        console.log(id);
        const res = await axios.delete(`https://discord.com/api/v9/channels/${global.channel_id}/messages/${id}`, {headers: headers})
        console.log(res);
    } catch(e) {
        console.log("Error", e);
    }
}

const sendMessageOnTime = async (msg) => {
    const content = msg.content;
    const time = msg.time;

    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();
    const h_check = time.h ? time.h==h : true;
    const m_check = time.m ? time.m==m : true;
    const s_check = time.s ? time.s==s : true;
    if(h_check && m_check && s_check)
    {
       if(msg.sent)return;
       msg.sent = true;
       const val = shortAnswerKeywords[content];
       if(msg.content==key )
        {
            if(val.type=="text")await sendTextMessage(val.msg);
            else if(val.type=="img")await sendImageMessage(val.msg);
        }
    }else{
        msg.sent = false;
    }
}

const findLastUserMessage = (messages, user) => {
    if(messages==undefined)return null;
    const msgs = messages.filter(f=>f.author.id==user)
    return msgs.length > 0 ? msgs[0] : null
}

const getLastMessages = async () => {
    try {
        const res = await axios.get(`https://discord.com/api/v9/channels/${global.channel_id}/messages?limit=10`, {
            headers: {
                'Authorization': global.auth
            } 
        })
        return res.data;
    }catch(e){
        console.log("Error pobieranie danych: ", e)
    }
}

const handleUserMessage = async (msg) => {
    if(!msg)return null;
    for([key, val] of Object.keys(shortAnswerKeywords).map((key)=>[key, shortAnswerKeywords[key]]))
    {
        if(msg.content==key )
        {
            if(val.type=="text")await sendTextMessage(val.msg);
            else if(val.type=="img")await sendImageMessage(val.msg);

            if(val.del)delMessageById(msg.id)
        }
    }
}

const loadImage = async(path) => {
    try{
        const res = await axios.get(path, { responseType: 'arraybuffer' })
        return res.data
    } catch(e) {
        console.log("Error while opening image: ",e,path)
    }
}

const sendImageMessage = async(path) => { 
    const img = await loadImage(path);
    headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': global.auth
    }

    const imgType = path.split(".")[path.split(".").length-1];

    const formData = new FormData();
    formData.append('content', '');
    formData.append('file', new Blob([img], {type: `image/${imgType}`}), `img.${imgType}`);

    payload = {
        'content': '',
        'files': img
    }
    
    try {
        const res = await axios.post(`https://discord.com/api/v9/channels/${global.channel_id}/messages`, 
            formData, {headers: headers}) 
    } catch(e) {
        console.log("Error: ", JSON.stringify(e))
    }
}

const sendTextMessage = async (msg) => {
    console.log("dupa")
    const payload = {
        'content': msg
    }

    const headers = {
        'Authorization': global.auth
    }

    try {
        const res = await axios.post(`https://discord.com/api/v9/channels/${global.channel_id}/messages`, 
                    payload, {headers: headers}) 
    } catch(e) {
        console.log("Error: ", JSON.stringify(e))
    }
}

const loop = () =>{
    setInterval(async ()=>{
        msgs = await getLastMessages()
        const userMsg = findLastUserMessage(msgs, global.user_id)
        await handleUserMessage(userMsg) 
        for(let i=0;i<messagesOnTime.length;i++)
        {
            await sendMessageOnTime(messagesOnTime[i]);
        }

    }, 2000)
}

loop();