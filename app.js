// Navigation function
function navigateTo(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show selected screen
    document.getElementById(screenId).classList.add('active');

    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show/hide navbar based on screen
    const navbar = document.querySelector('.navbar');
    if (screenId === 'login') {
        navbar.style.display = 'none';
    } else {
        navbar.style.display = 'flex';
    }

    // Highlight active nav item
    const activeNav = {
        'dashboard': 0,
        'assignments': 1,
        'progress': 2,
        'profile': 3
    };

    if (activeNav[screenId] !== undefined) {
        document.querySelectorAll('.nav-btn')[activeNav[screenId]].classList.add('active');
    }
}

// Help modal functions
function showHelp() {
    const helpContent = document.getElementById('help-content');

    if (currentQuestion === 1) {
        helpContent.innerHTML = `
            <ul>
                <li>For 3x², use the power rule: d/dx(x²) = 2x</li>
                <li>For 5x, the derivative is simply 5</li>
                <li>Constant -2 becomes 0 when differentiated</li>
                <li>Therefore: 3(2x) + 5 + 0 = 6x + 5</li>
            </ul>
        `;
    } else if (currentQuestion === 2) {
        helpContent.innerHTML = `
            <ul>
                <li>Use the power rule for integration: ∫x^n dx = x^(n+1)/(n+1) + C</li>
                <li>For 2x: ∫2x dx = 2∫x dx = 2(x²/2) = x²</li>
                <li>For 3: ∫3 dx = 3x</li>
                <li>Don't forget the constant of integration!</li>
                <li>Therefore: x² + 3x + C</li>
            </ul>
        `;
    } else if (currentQuestion === 3) {
        helpContent.innerHTML = `
            <ul>
                <li>This is the definition of the derivative of sin(x) at x=0</li>
                <li>Use L'Hôpital's rule or the squeeze theorem</li>
                <li>sin(x) ≈ x for small values of x</li>
                <li>As x approaches 0, sin(x)/x approaches 1</li>
                <li>Therefore: 1</li>
            </ul>
        `;
    }

    document.getElementById('help-modal-overlay').style.display = 'block';
}

function hideHelp() {
    document.getElementById('help-modal-overlay').style.display = 'none';
}

// Close modal on outside click
document.getElementById('help-modal-overlay').addEventListener('click', function (e) {
    if (e.target === this) {
        hideHelp();
    }
});

// Quiz variables
let currentQuestion = 1;
let totalQuestions = 3;
let quizScore = 0;
let attempts = 0;
let currentStudentLevel = 78;
const correctAnswers = {
    1: '6x + 5',
    2: 'x² + 3x + C',
    3: '1'
};

// Copy answer to field function
function copyAnswerToField() {
    const correctAnswer = correctAnswers[currentQuestion];
    if (correctAnswer) {
        document.getElementById('quiz-answer').value = correctAnswer;
        hideHelp();
    }
}

// Check quiz answer function
function checkQuizAnswer() {
    const userAnswer = document.getElementById('quiz-answer').value.trim();
    const correctAnswer = correctAnswers[currentQuestion];
    const feedbackDiv = document.getElementById('answer-feedback');
    const nextBtn = document.getElementById('quiz-next-btn');

    if (!userAnswer) {
        feedbackDiv.textContent = 'Please enter an answer';
        feedbackDiv.style.color = '#ff4444';
        return;
    }

    // Check if answer is correct
    let isCorrect = false;
    if (currentQuestion === 1) {
        // Accept various formats: 6x+5, 6x + 5, 5+6x, etc.
        isCorrect = userAnswer.toLowerCase().replace(/\s+/g, '').match(/6x\+5|5\+6x/) !== null;
    } else if (currentQuestion === 2) {
        // Accept various formats: x²+3x+C, x^2+3x+C, x*x+3x+C, etc.
        const normalizedAnswer = userAnswer.toLowerCase().replace(/\s+/g, '');
        isCorrect = normalizedAnswer.match(/x\^2\+3x\+[cC]|x²\+3x\+[cC]|x\*x\+3x\+[cC]|3x\+x\^2\+[cC]|3x\+x²\+[cC]|3x\+x\*x\+[cC]/) !== null;
    } else if (currentQuestion === 3) {
        isCorrect = userAnswer === '1';
    }

    if (isCorrect) {
        feedbackDiv.textContent = 'Correct! Well done!';
        feedbackDiv.style.color = '#4CAF50';
        quizScore++;
        nextBtn.textContent = 'Next Question';
        nextBtn.onclick = nextQuestion;

        if (attempts === 0) {
            currentStudentLevel += 2;
        } else {
            currentStudentLevel += 1;
        }
    } else {
        attempts++;

        if (attempts >= 3) {
            // After 3 attempts, move to next question
            feedbackDiv.textContent = 'Moving to next question...';
            feedbackDiv.style.color = '#ff9800';
            nextBtn.textContent = 'Next Question';
            nextBtn.onclick = nextQuestion;

            // Only complete quiz if on last question
            if (currentQuestion === 3) {
                setTimeout(() => {
                    completeQuiz();
                }, 1500);
            } else {
                setTimeout(() => {
                    nextQuestion();
                }, 1500);
            }
        } else {
            feedbackDiv.textContent = `Not quite right. Try again! (Attempt ${attempts}/3)`;
            feedbackDiv.style.color = '#ff4444';

            if (attempts >= 2) {
                feedbackDiv.textContent += ' Use "Get Help" for more assistance.';
            }
        }
    }
}

// Next question function
function nextQuestion() {
    if (currentQuestion < totalQuestions) {
        // Hide current question
        document.querySelector(`.question-item[data-question="${currentQuestion}"]`).style.display = 'none';

        // Show next question
        currentQuestion++;
        document.querySelector(`.question-item[data-question="${currentQuestion}"]`).style.display = 'block';
        document.getElementById('quiz-progress').textContent = `Question ${currentQuestion}/${totalQuestions}`;

        // Reset for new question
        document.getElementById('quiz-answer').value = '';
        document.getElementById('answer-feedback').textContent = '';
        attempts = 0;

        // Reset button
        const nextBtn = document.getElementById('quiz-next-btn');
        nextBtn.textContent = 'Check Answer';
        nextBtn.onclick = checkQuizAnswer;
    } else {
        // Quiz complete
        completeQuiz();
    }
}

// Complete quiz function
function completeQuiz() {
    const percentage = Math.round((quizScore / totalQuestions) * 100);

    // Update student level based on performance
    if (quizScore === totalQuestions) {
        currentStudentLevel += 5; // Bonus for perfect score
    }

    // Update progress on dashboard
    updateProgressAfterQuiz();

    // Update completion screen
    document.getElementById('quiz-score').textContent = `${quizScore}/${totalQuestions} (${percentage}%)`;
    document.getElementById('new-student-level').textContent = currentStudentLevel;

    // Navigate to completion screen
    navigateTo('quiz-complete');
}

// Update progress after quiz
function updateProgressAfterQuiz() {
    // Update student level display
    const levelDisplay = document.querySelector('.card h3 + div span');
    if (levelDisplay) {
        levelDisplay.textContent = `${currentStudentLevel}/100`;
    }

    // Update progress bar
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = `${currentStudentLevel}%`;
    }

    // Update points gained
    const pointsGained = document.querySelector('.card h3 + div span:last-child');
    if (pointsGained) {
        pointsGained.textContent = `+${currentStudentLevel - 78} today`;
    }
}

// Initialize chart (Bar Chart)
function initChart() {
    const canvas = document.getElementById('progressChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Sample data for the last 7 days
    const data = [65, 68, 72, 70, 74, 76, currentStudentLevel];
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Chart settings
    const padding = 20;
    const width = canvas.width - (padding * 2);
    const height = canvas.height - (padding * 2);
    const maxValue = 100;
    const minValue = 60;
    const valueRange = maxValue - minValue;
    const barWidth = width / (data.length * 1.5);
    const barSpacing = barWidth * 0.5;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding + (height / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
    }

    // Draw bars
    data.forEach((value, index) => {
        const x = padding + (barWidth + barSpacing) * index + barSpacing / 2;
        const barHeight = ((value - minValue) / valueRange) * height;
        const y = padding + height - barHeight;

        // Bar gradient
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, index === data.length - 1 ? '#2E7D32' : '#4CAF50');
        gradient.addColorStop(1, index === data.length - 1 ? '#4CAF50' : '#81C784');

        // Draw bar
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Draw value on top of bar
        ctx.fillStyle = '#333';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(value, x + barWidth / 2, y - 5);
    });

    // Draw labels
    ctx.fillStyle = '#666';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';

    labels.forEach((label, index) => {
        const x = padding + (barWidth + barSpacing) * index + barSpacing / 2 + barWidth / 2;
        ctx.fillText(label, x, canvas.height - 5);
    });

    // Draw Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
        const value = minValue + (valueRange / 4) * i;
        const y = padding + height - (height / 4) * i + 3;
        ctx.fillText(Math.round(value), padding - 5, y);
    }

    // Draw title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Student Level Progress', padding, padding - 5);
}

// Filter subject function
function filterSubject(subject) {
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    event.target.classList.add('active');

    // Filter assignments
    const assignments = document.querySelectorAll('.assignment-card');
    assignments.forEach(card => {
        if (subject === 'all' || card.dataset.subject === subject) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function () {
    // Set initial navigation state
    navigateTo('login');

    // Initialize chart when progress screen is shown
    const progressScreen = document.getElementById('progress');
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (progressScreen.classList.contains('active')) {
                    setTimeout(initChart, 100); // Small delay to ensure canvas is ready
                }
            }
        });
    });

    observer.observe(progressScreen, {
        attributes: true,
        attributeFilter: ['class']
    });
});

// Set initial navigation state
navigateTo('login');