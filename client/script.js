// import bot from "./assets/bot.svg";
// import user from "./assets/user.svg";

// const form = document.querySelector("form");
// const chatContainer = document.querySelector("#chat_container");
// let LoadInterval;
// function loader(element) {
//   element.textContent = "";

//   LoadInterval = setInterval(() => {
//     element.textContent += ".";
//     if (element.textContent === "....") {
//       element.textContent = "";
//     }
//   }, 300);
// }
// function typetext(element, text) {
//   let index = 0;
//   let interval = setInterval(() => {
//     if (index < text.length) {
//       element.innerHTML += text.charAt(index);
//       index++;
//     } else {
//       clearInterval(interval);
//     }
//   }, 20);
// }
// function generateUniqueID() {
//   const timeStamp = Date.now();
//   const randomNumber = Math.random();
//   const hexaDecimaString = randomNumber.toString(16);

//   return `id-${timeStamp}-${hexaDecimaString}`;
// }
// function chatStrip(isAi, value, uniqueId) {
//   return( ` 
//   <div class="wrapper ${isAi && 'ai'}">
//       <div class="chat">
//         <div class="profile">
//           <img
//             src="${isAi ? bot : user}"
//             alt="${isAi ? "bot" : "user"}"
//           />
//         </div>
//         <div class="message" id=${uniqueId}> ${value} </div>
//       </div>
//     </div>   
//      `
//     )
// }
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   const data = new FormData(form);
//   //user chat strip
//   chatContainer.innerHTML += chatStrip(false, data.get("prompt"));
//   form.reset();

//   //bot chat strip
//   const uniqueId = generateUniqueID();
//   chatContainer.innerHTML += chatStrip(true, " ", uniqueId);

//   chatContainer.scrollTop = chatContainer.scrollHeight;
//   const messageDiv = document.getElementById(uniqueId);
//   loader(messageDiv);
//   const response = await fetch('http://localhost:5000/',{
//     method:'POST',
//     headers:{
//       'Content-Type':'application/json'
//     },
//     body: JSON.stringify({
//       prompt : data.get('prompt')
//     })
//   })
//   clearInterval(LoadInterval);
//   messageDiv.innerHTML='';
//   if (response.ok) {
//     const data = await response.json();
//     const parsedData =data.bot.trim();
//     console.log(parsedData)
//     typetext(messageDiv,parsedData)
//   }
//   else{
//     const err =await  response.text();
//     messageDiv.innerHTML ="something went wrong";
//     alert(err);
//   }
// };
// form.addEventListener("submit", handleSubmit);
// form.addEventListener("keyup", (e) => {
//   if (e.keyCode == 13) {
//     handleSubmit(e);
//   }
// });

import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}

const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData(form)

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

    // to clear the textarea input 
    form.reset()

    // bot's chatstripe
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div 
    const messageDiv = document.getElementById(uniqueId)

    // messageDiv.innerHTML = "..."
    loader(messageDiv)

    const response = await fetch('https://code-x-your-coding-partner.onrender.com/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(loadInterval)
    messageDiv.innerHTML = " "

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 

        typeText(messageDiv, parsedData)
    } else {
        const err = await response.text()

        messageDiv.innerHTML = "Something went wrong"
        alert(err)
    }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})