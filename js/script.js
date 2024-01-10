function showMenu() {
    menuBtn.classList.toggle('is-active');
    menuBar.classList.toggle('is-active');
    menuList.classList.toggle('is-active');
}

$(document).ready(function () {
    $("#input").keypress(function (event) {
        if (event.which === 13) {
            event.preventDefault();
            send();
        }
    });
    $("#rec").click(function () {
        send();
    });
});

function send() {
    var text = $("#input").val();
    callOpenAPI(text);
}

function callOpenAPI(userInput) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer "+openaiKeyFunc("me-CBWX7kMoYyD1CgpJsTnkN3VfveZDrqhE3TkNfVTw7pLXbIKi"));

    var raw = JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [
            {
                "role": "user",
                "content": "INSTRUCTIONS:1.!IMPORTANT You are an AI chatbot named Golgappa. You have all the knowledge about your creator. The person who created you is a Developer named Shakir Sadiq."
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
                "content": userInput
            }
        ],
        "temperature": 1,
        "max_tokens": 1000,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://api.openai.com/v1/chat/completions", requestOptions)
        .then(response => response.json())
        .then(result => {
            // Handle the OpenAI API response
            handleOpenAIResponse(result.choices[0].message.content);
        })
        .catch(error => console.log('error', error));
}

function handleOpenAIResponse(responseText) {
    // Do any processing on the OpenAI response if needed
    setResponse(responseText);
}

function setResponse(val) {
    $("#response").html(val);
}

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
    console.log(result)
    return result;
}
