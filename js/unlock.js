// 解锁页逻辑

// 预设的兑换码列表（实际应该从后端获取）
const validCodes = [
    'TEST2024',
    'LOVE123',
    'DEMO2025',
    'UNLOCK01'
];

// 页面加载时
document.addEventListener('DOMContentLoaded', () => {
    // 从 localStorage 获取答题数据
    const answersStr = localStorage.getItem('answers');
    if (!answersStr) {
        alert('未找到测评数据，请重新开始测评');
        window.location.href = 'index.html';
        return;
    }

    // 计算结果
    const answers = JSON.parse(answersStr);
    const result = calculateAttachment(answers);

    // 显示倾向类型预览
    const tendencyMap = {
        'Anxious': '【焦虑倾向】',
        'Avoidant': '【回避倾向】',
        'Fearful': '【矛盾倾向】',
        'Secure': '【安全倾向】',
        'MixAnxious': '【偏焦虑倾向】',
        'MixAvoidant': '【偏回避倾向】',
        'MixComplex': '【复杂倾向】'
    };

    document.getElementById('tendencyType').textContent = tendencyMap[result.attachmentType] || '【隐性倾向】';

    // 保存结果到 localStorage
    localStorage.setItem('result', JSON.stringify(result));
});

// 验证兑换码
function verifyCode() {
    const input = document.getElementById('codeInput');
    const code = input.value.trim().toUpperCase();
    const errorMsg = document.getElementById('errorMsg');

    if (!code) {
        showError('请输入兑换码');
        return;
    }

    // 验证兑换码
    if (validCodes.includes(code)) {
        // 验证成功
        localStorage.setItem('unlocked', 'true');
        window.location.href = 'report.html';
    } else {
        showError('兑换码无效，请检查后重试');
        input.value = '';
        input.focus();
    }
}

// 显示错误信息
function showError(message) {
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';

    setTimeout(() => {
        errorMsg.style.display = 'none';
    }, 3000);
}

// 跳过到报告（基础版）
function skipToReport() {
    localStorage.setItem('unlocked', 'false');
    window.location.href = 'report.html';
}

// 支持回车键提交
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('codeInput');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                verifyCode();
            }
        });
    }
});
