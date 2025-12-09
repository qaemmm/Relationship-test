// 答题页逻辑
// 注意：需要在HTML中先加载 algorithm.js
let questions = [];
let currentQuestion = 0;
let answers = {};

// 加载题库
async function loadQuestions() {
    try {
        const response = await fetch('data/questions.json');
        questions = await response.json();
        displayQuestion();
    } catch (error) {
        console.error('加载题库失败:', error);
        alert('题库加载失败，请刷新页面重试');
    }
}

// 显示当前题目
function displayQuestion() {
    const question = questions[currentQuestion];

    document.getElementById('questionNumber').textContent = `第 ${currentQuestion + 1} 题`;
    document.getElementById('questionText').textContent = question.text;
    document.getElementById('progressText').textContent = `${currentQuestion + 1} / 24`;

    // 更新进度条
    const progress = ((currentQuestion + 1) / 24) * 100;
    document.querySelector('.progress-bar').style.setProperty('--progress', `${progress}%`);
    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.background = `linear-gradient(to right, var(--color-primary) ${progress}%, rgba(255, 182, 193, 0.2) ${progress}%)`;

    // 显示/隐藏返回按钮
    document.getElementById('backBtn').style.display = currentQuestion > 0 ? 'block' : 'none';

    // 移除之前的选中状态
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    // 如果已经作答，显示之前的选择
    if (answers[question.id]) {
        const selectedBtn = document.querySelector(`[data-value="${answers[question.id]}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
        }
    }
}

// 选择答案
function selectAnswer(value) {
    const questionId = questions[currentQuestion].id;
    answers[questionId] = parseInt(value);

    // 高亮选中的选项
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.closest('.option-btn').classList.add('selected');

    // 保存到 localStorage
    localStorage.setItem('answers', JSON.stringify(answers));

    // 延迟跳转下一题
    setTimeout(() => {
        nextQuestion();
    }, 300);
}

// 下一题
function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        displayQuestion();
    } else {
        // 完成测评，计算结果并直接跳转到报告页
        const answers = JSON.parse(localStorage.getItem('answers'));
        const result = calculateAttachment(answers);
        localStorage.setItem('result', JSON.stringify(result));

        // 跳转到报告页（已在首页验证过兑换码）
        window.location.href = 'report.html';
    }
}

// 上一题
function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 尝试恢复之前的进度
    const savedAnswers = localStorage.getItem('answers');
    if (savedAnswers) {
        answers = JSON.parse(savedAnswers);
    }

    // 加载题库
    loadQuestions();

    // 绑定选项点击事件
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const value = e.currentTarget.getAttribute('data-value');
            selectAnswer(value);
        });
    });
});
