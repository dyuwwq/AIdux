const voiceBtn = document.getElementById("voiceBtn");
const voiceText = document.getElementById("voiceText");

// Примеры вопросов и ответов
const responses = {
    "привет": "Привет, по вашему велению, великий создатель! Как ваши дела?",
    "как дела": "Все отлично, по вашему хотению! Готов к работе.",
    "зачем нужна карта": "Эта карта создана для научной работы и навигации по городу и сёлам.",
    "о чем этот сайт": "Сайт AIDUX создан для демонстрации 3D-карт и умных маршрутов и также AR-визуализации.",
    "зачем создана карта": "Карта помогает понять города и сёла людям с ограниченными возможностями более точнее и внедрять IT-технологии в жизнь.",
    "открой мне карту": () => window.location.href = "map.html",
    "открой мне страницу о проекте": () => window.location.href = "about.html",
    "открой мне страницу камера": () => window.location.href = "camera.html",
    "открой мне страницу связь": () => window.location.href = "contact.html",
    "перекинь меня на страницу карта": () => window.location.href = "map.html",
    "перекинь меня на страницу о проекте": () => window.location.href = "about.html",
    "перекинь меня на страницу камера": () => window.location.href = "camera.html",
    "перекинь меня на страницу связь": () => window.location.href = "contact.html",
    "спасибо": "По вашему велению, великий создатель, рад был помочь!",
};

let recognition;

if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
        voiceText.textContent = "Слушаю…";
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log("Распознано:", transcript);

        let answered = false;
        for (let key in responses) {
            if (transcript.includes(key)) {
                const resp = responses[key];
                if (typeof resp === "function") {
                    resp();
                    speak("По вашему велению, великий создатель!");
                } else {
                    speak(resp);
                }
                answered = true;
                break;
            }
        }

        if (!answered) {
            speak("Извините, пока не знаю ответа. Попробуйте другой вопрос.");
        }
    };

    recognition.onerror = (event) => {
        voiceText.textContent = "Ошибка распознавания: " + event.error;
    };
}

voiceBtn.addEventListener("click", () => {
    if (recognition) recognition.start();
});

function speak(text) {
    voiceText.textContent = text;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ru-RU";
    utter.rate = 1.5;   // немного быстрее
    utter.pitch = 0.0001;  // более мужской тембр
    speechSynthesis.speak(utter);
}