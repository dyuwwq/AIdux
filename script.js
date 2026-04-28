document.addEventListener("DOMContentLoaded", () => {

    // BURGER MENU
    const burger = document.querySelector(".burger");
    const nav = document.querySelector(".nav-links");
    if (burger && nav) burger.addEventListener("click", () => nav.classList.toggle("active"));

    // Анимация
    document.querySelectorAll(".hidden").forEach((el, i) => setTimeout(()=>el.classList.add("visible"), i*200));

    // Камера
    const video = document.getElementById("webcam");
    if (video && navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then(stream => video.srcObject = stream)
        .catch(err => console.error(err));
    }

    // Форма
    const form = document.getElementById("form");
    const msg = document.getElementById("msg");
    if (form && msg) {
        form.addEventListener("submit", e=>{
            e.preventDefault();
            msg.style.display="block";
            form.reset();
        });
    }

    // Голосовой ассистент
    const voiceBtn = document.getElementById("voiceBtn");
    const voiceText = document.getElementById("voiceText");

    if (voiceBtn && voiceText) {
        let recognition;
        if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            recognition.lang = "ru-RU";
            recognition.interimResults = false;
            recognition.continuous = false;

            recognition.onstart = ()=>voiceText.textContent="Слушаю…";
            recognition.onerror = e=>voiceText.textContent="Ошибка: "+e.error;
            recognition.onresult = e=>{
                const transcript = e.results[0][0].transcript.toLowerCase();
                handleCommand(transcript);
            };
        }

        voiceBtn.addEventListener("click", ()=>{ if(recognition) recognition.start(); });
    }

    function handleCommand(text){
        const responses = {
            "привет":"Привет, по вашему велению! Как ваши дела?",
            "как дела":"Все отлично, готов к работе.",
            "зачем нужна карта":"Карта для навигации и AR.",
            "о чем этот сайт":"AIDUX демонстрирует 3D-карты и маршруты.",
            "открой карту": ()=>window.location.href="map.html",
            "открой проект": ()=>window.location.href="about.html",
            "открой камеру": ()=>window.location.href="camera.html",
            "связь": ()=>window.location.href="contact.html",
            "спасибо":"Рад был помочь!"
        };
        let answered=false;
        for(let key in responses){
            if(text.includes(key)){
                const resp = responses[key];
                if(typeof resp==="function"){ resp(); speak("По вашему велению!"); }
                else speak(resp);
                answered=true; break;
            }
        }
        if(!answered) speak("Извините, пока не знаю ответа.");
    }

    function speak(text){
        voiceText.textContent=text;
        const utter=new SpeechSynthesisUtterance(text);
        utter.lang="ru-RU";
        utter.rate=1.2;
        speechSynthesis.speak(utter);
    }
});