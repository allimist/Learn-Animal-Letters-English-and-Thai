const animalsEnglish = [
  { name: 'Cat', img: 'images/cat.jpg' },
  { name: 'Dog', img: 'images/dog.jpg' },
  { name: 'Elephant', img: 'images/elephant.jpg' },
  { name: 'Lion', img: 'images/lion.jpg' },
  { name: 'Tiger', img: 'images/tiger.jpg' },
  { name: 'Monkey', img: 'images/monkey.jpg' },
  { name: 'Horse', img: 'images/horse.jpg' },
  { name: 'Bear', img: 'images/bear.jpg' },
  { name: 'Kangaroo', img: 'images/kangaroo.jpg' },
  { name: 'Penguin', img: 'images/penguin.jpg' }
];

const animalsThai = [
  { name: 'แมว', img: 'images/cat.jpg' },
  { name: 'สุนัข', img: 'images/dog.jpg' },
  { name: 'ช้าง', img: 'images/elephant.jpg' },
  { name: 'สิงโต', img: 'images/lion.jpg' },
  { name: 'เสือ', img: 'images/tiger.jpg' },
  { name: 'ลิง', img: 'images/monkey.jpg' },
  { name: 'ม้า', img: 'images/horse.jpg' },
  { name: 'หมี', img: 'images/bear.jpg' },
  { name: 'จิงโจ้', img: 'images/kangaroo.jpg' },
  { name: 'เพนกวิน', img: 'images/penguin.jpg' }
];

const languageSelect = document.getElementById('language');
const gameContainer = document.getElementById('game-container');
const nextAnimalBtn = document.getElementById('next-animal');
const feedbackDiv = document.getElementById('feedback');

// Load sounds
const correctSound = new Audio('sounds/correct.mp3');
const wrongSound = new Audio('sounds/incorrect.mp3');

let currentAnimalIndex = 0;
let selectedLanguage = 'en';
let currentAnimals = animalsEnglish;

languageSelect.addEventListener('change', () => {
  selectedLanguage = languageSelect.value;
  currentAnimals = selectedLanguage === 'th' ? animalsThai : animalsEnglish;
  currentAnimalIndex = 0;
  renderAnimal();
  clearFeedback();
});

nextAnimalBtn.addEventListener('click', () => {
  currentAnimalIndex = (currentAnimalIndex + 1) % currentAnimals.length;
  renderAnimal();
  clearFeedback();
});

function shuffleArray(arr) {
  return arr
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function renderAnimal() {
  const animal = currentAnimals[currentAnimalIndex];
  const letters = Array.from(animal.name); // Works for Thai too

  const allLetters = [...letters];

  while (allLetters.length < letters.length + 5) {
    let randomChar;
    if (selectedLanguage === 'en') {
      randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    } else {
      randomChar = String.fromCharCode(0x0E01 + Math.floor(Math.random() * (0x0E5B - 0x0E01)));
    }
    allLetters.push(randomChar);
  }

  const shuffledLetters = shuffleArray(allLetters);

  gameContainer.innerHTML = `
    <img src="${animal.img}" alt="${animal.name}" />
    <div class="letters" id="letter-options">
      ${shuffledLetters.map((letter, index) => `<div class="letter-box" data-letter="${letter}" data-id="${index}">${letter}</div>`).join('')}
    </div>
    <div class="letters" id="letter-answer">
      ${letters.map(() => `<div class="letter-box"></div>`).join('')}
    </div>
  `;

  setupLetterClick(letters);
}

function setupLetterClick(correctLetters) {
  const letterOptions = document.getElementById('letter-options');
  const letterAnswer = document.getElementById('letter-answer');

  const answerSlots = Array.from(letterAnswer.children);
  const optionBoxes = Array.from(letterOptions.children);

  optionBoxes.forEach(box => {
    box.addEventListener('click', () => {
      if (box.classList.contains('selected')) return;

      const emptySlot = answerSlots.find(slot => !slot.textContent);
      if (!emptySlot) return;

      emptySlot.textContent = box.dataset.letter;
      emptySlot.dataset.optionId = box.dataset.id;
      box.classList.add('selected');

      checkAnswer();
    });
  });

  answerSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      if (!slot.textContent) return;

      const optionId = slot.dataset.optionId;
      const correspondingOption = optionBoxes.find(b => b.dataset.id === optionId);
      if (correspondingOption) {
        correspondingOption.classList.remove('selected');
      }

      slot.textContent = '';
      slot.removeAttribute('data-option-id');

      clearFeedback();
    });
  });

  function checkAnswer() {
    const userAnswer = answerSlots.map(slot => slot.textContent || '').join('');
    const correctAnswer = correctLetters.join('');
    if (userAnswer.length === correctAnswer.length) {
      if (userAnswer === correctAnswer) {
        correctSound.play();
        showFeedback(
          selectedLanguage === 'en'
            ? `✅ Correct! It's a ${correctAnswer}`
            : `✅ ถูกต้อง! นี่คือ ${correctAnswer}`,
          'success'
        );
        setTimeout(() => {
          nextAnimalBtn.click();
        }, 1000);
      } else {
        wrongSound.play();
        showFeedback(
          selectedLanguage === 'en'
            ? `❌ Try again! That's not correct.`
            : `❌ ลองใหม่อีกครั้ง! คำสะกดไม่ถูกต้อง`,
          'error'
        );
      }
    }
  }
}

function showFeedback(message, type) {
  feedbackDiv.textContent = message;
  feedbackDiv.className = 'feedback ' + type;
}

function clearFeedback() {
  feedbackDiv.textContent = '';
  feedbackDiv.className = 'feedback';
}

// Start the game
renderAnimal();
