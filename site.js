const toggle = document.querySelector('.menu');
const navigation = document.querySelector('#navigation');
toggle.hidden = false;

function closeMenu() {
  toggle.setAttribute('aria-expanded', 'false');
}

toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
});

navigation.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus({ preventScroll: true });
    }
  });
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    toggle.focus();
  }
});

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('arrived');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}


const carouselControls = document.querySelector('.carousel-controls');
const photos = [...document.querySelectorAll('.hero-media img')];
const dots = [...carouselControls.querySelectorAll('.slide-dot')];
const pauseButton = carouselControls.querySelector('.slide-pause');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let slideIndex = 0;
let interval;
let playing = !reducedMotion.matches;

function showSlide(index) {
  photos[slideIndex].classList.remove('current');
  dots[slideIndex].setAttribute('aria-pressed', 'false');
  slideIndex = index;
  photos[slideIndex].classList.add('current');
  dots[slideIndex].setAttribute('aria-pressed', 'true');
}

function updatePlayback() {
  clearInterval(interval);
  pauseButton.textContent = playing ? 'Pause' : 'Lecture';
  if (playing && !document.hidden) {
    interval = setInterval(() => showSlide((slideIndex + 1) % photos.length), 6500);
  }
}

dots.forEach((dot, index) => dot.addEventListener('click', () => {
  playing = false;
  showSlide(index);
  updatePlayback();
}));
pauseButton.addEventListener('click', () => {
  playing = !playing;
  updatePlayback();
});
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) {
    playing = false;
    updatePlayback();
  }
});
document.addEventListener('visibilitychange', updatePlayback);
carouselControls.hidden = false;
updatePlayback();

const chat = document.querySelector('.chat-panel');
const launchChat = document.querySelector('.chat-launch');
const closeChat = document.querySelector('.chat-close');
const chatForm = document.querySelector('.chat-form');
const questionInput = document.querySelector('#chat-question');
const answerBox = document.querySelector('.chat-answer');
const answers = {
  formation: ['Nous proposons des formations professionnelles et des ateliers adaptés aux besoins de vos équipes.', '#expertises', 'Découvrir les formations'],
  numerique: ['Nous concevons des logiciels sur mesure et proposons du conseil, des audits et de l’assistance technique.', '#expertises', 'Découvrir les expertises'],
  evenement: ['Nous accompagnons la préparation de conférences, de séminaires, d’ateliers et de lancements professionnels à Kinshasa.', '#evenementiel', 'Voir l’offre événementielle'],
  contact: ['Retrouvez-nous à Silikin Village, à Kinshasa. Téléphone +243 813 084 408. E-mail contact@imarainvest.cd.', '#contact', 'Voir les coordonnées'],
  other: ['Je peux vous renseigner sur les formations, les solutions numériques, l’événementiel et les coordonnées.', 'mailto:contact@imarainvest.cd', 'Écrire à IMARA INVEST']
};

function setChatOpen(open) {
  chat.hidden = !open;
  launchChat.setAttribute('aria-expanded', String(open));
  (open ? closeChat : launchChat).focus();
}

function reply(topic) {
  const [message, href, label] = answers[topic];
  const text = document.createElement('p');
  text.textContent = message;
  const link = document.createElement('a');
  link.href = href;
  link.textContent = label;
  if (href.startsWith('#')) {
    link.addEventListener('click', () => setChatOpen(false));
  }
  answerBox.replaceChildren(text, link);
  answerBox.scrollIntoView({ block: 'nearest' });
}

function matchTopic(question) {
  const normalized = question.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
  if (/contact|mail|@|telephone|numero|adresse|siege|joindre|situe|itineraire|appel/.test(normalized)) return 'contact';
  if (/evenement|conference|seminaire|lancement|organis|atelier/.test(normalized)) return 'evenement';
  if (/formation|cours|apprendre|competence/.test(normalized)) return 'formation';
  if (/numerique|logiciel|audit|conseil|digital|application|techno|developpement/.test(normalized)) return 'numerique';
  return 'other';
}

launchChat.hidden = false;
launchChat.addEventListener('click', () => setChatOpen(chat.hidden));
closeChat.addEventListener('click', () => setChatOpen(false));
document.querySelectorAll('[data-topic]').forEach(button => {
  button.addEventListener('click', () => reply(button.dataset.topic));
});
chatForm.addEventListener('submit', event => {
  event.preventDefault();
  reply(matchTopic(questionInput.value.trim()));
  questionInput.value = '';
});
chat.addEventListener('keydown', event => {
  if (event.key === 'Escape') setChatOpen(false);
});
