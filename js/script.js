const baseUrl = 'https://api.openai.com/v1/chat/completions';
const loader = `<span class='loader'><span class='loader__dot'></span><span class='loader__dot'></span><span class='loader__dot'></span></span>`;
const errorMessage = 'Apologies, I am currently unavailable. Please feel free to reach out to me via email at shakirsadiq24@gmail.com.';
const urlPattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
const $document = document;
const $chatbot = $document.querySelector('.chatbot');
const $chatbotMessageWindow = $document.querySelector('.chatbot__message-window');
const $chatbotHeader = $document.querySelector('.chatbot__header');
const $chatbotMessages = $document.querySelector('.chatbot__messages');
const $chatbotInput = $document.querySelector('.chatbot__input');
const $chatbotSubmit = $document.querySelector('.chatbot__submit');

const botLoadingDelay = 1000;
const botReplyDelay = 2000;

document.addEventListener('keypress', event => {
  if (event.which == 13) validateMessage();
}, false);

$chatbotHeader.addEventListener('click', () => {
  toggle($chatbot, 'chatbot--closed');
  $chatbotInput.focus();
}, false);

$chatbotSubmit.addEventListener('click', () => {
  validateMessage();
}, false);

const toggle = (element, klass) => {
  const classes = element.className.match(/\S+/g) || [];
  const index = classes.indexOf(klass);
  index >= 0 ? classes.splice(index, 1) : classes.push(klass);
  element.className = classes.join(' ');
};

const userMessage = content => {
  $chatbotMessages.innerHTML += `<li class='is-user animation'>
      <p class='chatbot__message'>
        ${content}
      </p>
      <span class='chatbot__arrow chatbot__arrow--right'></span>
    </li>`;
};

const aiMessage = (content, isLoading = false, delay = 0) => {
  setTimeout(() => {
    removeLoader();
    $chatbotMessages.innerHTML += `<li 
      class='is-ai animation' 
      id='${isLoading ? "is-loading" : ""}'>
        <div class="is-ai__profile-picture">
          <svg class="icon-avatar" viewBox="0 0 32 32">
            <use xlink:href="#avatar" />
          </svg>
        </div>
        <span class='chatbot__arrow chatbot__arrow--left'></span>
        <div class='chatbot__message'>${content}</div>
      </li>`;
    scrollDown();
  }, delay);
};

const removeLoader = () => {
  let loadingElem = document.getElementById('is-loading');
  if (loadingElem) $chatbotMessages.removeChild(loadingElem);
};

const escapeScript = unsafe => {
  const safeString = unsafe.
  replace(/</g, ' ').
  replace(/>/g, ' ').
  replace(/&/g, ' ').
  replace(/"/g, ' ').
  replace(/\\/, ' ').
  replace(/\s+/g, ' ');
  return safeString.trim();
};

const linkify = inputText => {
  return inputText.replace(urlPattern, `<a href='$1' target='_blank'>$1</a>`);
};

const validateMessage = () => {
  const text = $chatbotInput.value;
  const safeText = text ? escapeScript(text) : '';
  if (safeText.length && safeText !== ' ') {
    resetInputField();
    userMessage(safeText);
    sendOpenAIRequest(safeText);
  }
  scrollDown();
  return;
};

const processResponse = result => {
  if (result && result.choices && result.choices.length > 0) {
    const output = result.choices[0].message.content;
    return linkify(output);
  }

  return `<p>${errorMessage}</p>`;
};

const setResponse = (result, delay = 0) => {
  setTimeout(() => {
    aiMessage(processResponse(result));
  }, delay);
};

const resetInputField = () => {
  $chatbotInput.value = '';
};

const scrollDown = () => {
  const distanceToScroll =
    $chatbotMessageWindow.scrollHeight - (
    $chatbotMessages.lastChild.offsetHeight + 60);
  $chatbotMessageWindow.scrollTop = distanceToScroll;
  return false;
};

const sendOpenAIRequest = (text = '') => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer "+openaiKeyFunc("me-CBWX7kMoYyD1CgpJsTnkN3VfveZDrqhE3TkNfVTw7pLXbIKi"));

  const raw = JSON.stringify({
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "user",
        "content": "INSTRUCTIONS:1.!IMPORTANT You are an AI chatbot named Luna. You have all the knowledge about your creator. The person who created you is a Developer named Shakir Sadiq."
      },
      {
          "role": "user",
          "content": "With a solid 3+ years of experience in Python, I have honed my craft as a Backend Developer and brought numerous projects to life. My expertise spans various domains, including Web (Django, Flask) and API (DRF) development, where I excel at creating efficient and scalable and RESTful APIs. Additionally, I am well-versed in integrating Websites into cloud-based platforms, ensuring seamless interactions and top-notch performance."
      },
      {
          "role": "user",
          "content" : "Beyond API and web development, I have ventured into the captivating realms of Machine Learning (ML) and Artificial Intelligence (AI). Leveraging ML and AI algorithms, I have contributed to cutting-edge projects that utilize data-driven insights, automate processes, and enable informed decision-making. Furthermore, I have delved into the world of ChatGPT and chatbots, crafting interactive conversational interfaces to enhance user experiences."
      },
      {
          "role": "user",
          "content" : "Skills Shakir has: Python3, Golang, JavaScript, JQuery, Django, Flask, Web Automation, Chatbot Development, AI, ML, MySQL, PostgreSQL, MongoDB, JIRA, Git/Github, Linux, Mac, Windows."
      },
      {
        "role": "user",
        "content" : "Shakir's email is shakirsadiq24@gmail.com and Instagram is shakirsadiq6. If someone asks for phone number, please reply with I don't have permission to provide the phone number."
      },
      {
        "role": "user",
        "content" : "IMPORTANT! Keep the responses and answers in few lines or words only"
      },
      {
        "role": "user",
        "content": text
      }
    ],
    "temperature": 0.7,
    "max_tokens": 512,
    "top_p": 1,
    "frequency_penalty": 0,
    "presence_penalty": 0
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch(baseUrl, requestOptions)
    .then(response => response.json())
    .then(res => {
      if (res.error) {
        throw new Error(res.error.message);
      }
      return res;
    })
    .then(res => {
      setResponse(res, botLoadingDelay + botReplyDelay);
    })
    .catch(error => {
      setResponse(errorMessage, botLoadingDelay + botReplyDelay);
      resetInputField();
    });

  aiMessage(loader, true, botLoadingDelay);
};

function openaiKeyFunc(text) {
  let result = "";
  for (let i = 0; i < text.length; i++) {
      let char = text[i];
      if (char.match(/[a-z]/i)) {
          let asciiOffset = char === char.toUpperCase() ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
          result += String.fromCharCode(((char.charCodeAt(0) - asciiOffset - 20 + 26) % 26) + asciiOffset);
      } else {
          result += char;
      }
  }
  return result;
}
