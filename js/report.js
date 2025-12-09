// 报告页逻辑

let result = null;
let isUnlocked = false;

// 页面加载
document.addEventListener('DOMContentLoaded', () => {
    // 获取结果数据
    const resultStr = localStorage.getItem('result');
    if (!resultStr) {
        alert('未找到测评数据，请重新开始测评');
        window.location.href = 'index.html';
        return;
    }

    result = JSON.parse(resultStr);
    isUnlocked = localStorage.getItem('unlocked') === 'true';

    // 显示报告
    displayReport();
});

// 显示报告
async function displayReport() {
    // 加载文案数据
    const content = await loadContent();

    // 显示类型标题
    displayTypeHeader(content);

    // 显示数据可视化
    displayDataVisualization();

    // 显示/隐藏详细内容
    if (isUnlocked) {
        document.getElementById('lockedContent').style.display = 'none';
        document.getElementById('unlockedContent').style.display = 'block';
        displayDetailedContent(content);
    } else {
        document.getElementById('lockedContent').style.display = 'block';
        document.getElementById('unlockedContent').style.display = 'none';
    }
}

// 加载文案数据
async function loadContent() {
    try {
        const response = await fetch('data/content.json');
        return await response.json();
    } catch (error) {
        console.error('加载文案数据失败:', error);
        return getDefaultContent();
    }
}

// 显示类型标题
function displayTypeHeader(content) {
    const typeData = content.attachmentTypes[result.attachmentType];
    document.getElementById('typeTitle').textContent = typeData.title;
    document.getElementById('typeSubtitle').textContent = typeData.subtitle;
}

// 显示数据可视化
function displayDataVisualization() {
    // 更新得分条
    updateScoreBars();

    // 绘制雷达图
    drawRadarChart();
}

// 更新得分条
function updateScoreBars() {
    const scores = result.scores;

    // A 依恋焦虑
    document.getElementById('scoreA').style.width = `${(scores.A / 5) * 100}%`;
    document.getElementById('scoreAText').textContent = `${scores.A} 分 (${getLevelText(result.levels.A)})`;

    // B 依恋回避
    document.getElementById('scoreB').style.width = `${(scores.B / 5) * 100}%`;
    document.getElementById('scoreBText').textContent = `${scores.B} 分 (${getLevelText(result.levels.B)})`;

    // C 界限感
    document.getElementById('scoreC').style.width = `${(scores.C / 5) * 100}%`;
    document.getElementById('scoreCText').textContent = `${scores.C} 分 (${getLevelText(result.levels.C)})`;

    // D 自我价值
    document.getElementById('scoreD').style.width = `${(scores.D / 5) * 100}%`;
    document.getElementById('scoreDText').textContent = `${scores.D} 分 (${getLevelText(result.levels.D)})`;
}

// 获取等级文本
function getLevelText(level) {
    const map = {
        'Low': '低',
        'Mid': '中',
        'High': '高'
    };
    return map[level] || '-';
}

// 绘制雷达图
function drawRadarChart() {
    const ctx = document.getElementById('radarChart').getContext('2d');
    const scores = result.scores;

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['依恋焦虑', '依恋回避', '界限感', '自我价值稳定'],
            datasets: [{
                label: '你的评分',
                data: [scores.A, scores.B, scores.C, 5 - scores.D],  // D维度反转显示
                fill: true,
                backgroundColor: 'rgba(255, 182, 193, 0.2)',
                borderColor: 'rgb(255, 182, 193)',
                pointBackgroundColor: 'rgb(255, 182, 193)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 182, 193)'
            }]
        },
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
            },
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 5,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// 显示详细内容
function displayDetailedContent(content) {
    const typeData = content.attachmentTypes[result.attachmentType];
    const boundaryData = content.boundary[result.levels.C];
    const selfWorthData = content.selfWorth[result.levels.D];

    // 恋爱画像
    document.getElementById('portraitContent').innerHTML = formatContent(typeData.portrait);

    // 盲区与风险
    document.getElementById('riskContent').innerHTML = formatContent(typeData.risks);

    // 救急处方
    document.getElementById('adviceContent').innerHTML = formatContent(typeData.advice);

    // 界限感分析
    document.getElementById('boundaryContent').innerHTML = formatContent(boundaryData);

    // 自我价值分析
    document.getElementById('selfWorthContent').innerHTML = formatContent(selfWorthData);
}

// 格式化内容
function formatContent(text) {
    if (!text) return '<p>内容加载中...</p>';

    // 将换行符转换为 <p> 标签
    return text.split('\n').filter(line => line.trim())
        .map(line => {
            line = line.trim();
            // 如果是列表项
            if (line.startsWith('-') || line.startsWith('•')) {
                return `<li>${line.substring(1).trim()}</li>`;
            }
            return `<p>${line}</p>`;
        }).join('');
}

// 默认文案（备用）
function getDefaultContent() {
    return {
        attachmentTypes: {
            'Secure': {
                title: '安全型依恋',
                subtitle: '你能够在亲密和独立之间找到平衡',
                portrait: '你在关系中整体是安全型依恋。你能够在亲密和独立之间找到比较舒服的平衡。',
                risks: '即便是安全型，在压力大或遇到特殊对象时，也可能出现阶段性的焦虑/回避反应。',
                advice: '继续保持愿意沟通+接受差异的态度。'
            },
            'Anxious': {
                title: '焦虑型依恋',
                subtitle: '你对亲密有强烈渴望，但也常被"被抛弃"的恐惧困扰',
                portrait: '你在关系中更接近焦虑型依恋。你对亲密、陪伴和确认有很强的需求。',
                risks: '过度付出导致关系失衡、情绪起伏影响生活、容易吸引回避型伴侣。',
                advice: '练习分清"此刻冷淡" ≠ "永远不爱"。建立关系外的支撑系统。'
            },
            'Avoidant': {
                title: '回避型依恋',
                subtitle: '你对亲密有渴望，但本能反应是保持距离',
                portrait: '你在关系中更接近回避型依恋。一旦感觉对方太黏、太情绪化，你就想后退。',
                risks: '让伴侣持续不安、压抑需求导致突然爆发。',
                advice: '允许自己从小步开始分享真实感受。'
            },
            'Fearful': {
                title: '恐惧-回避型',
                subtitle: '你既渴望亲密又害怕被伤害',
                portrait: '你在关系中更接近恐惧-回避型依恋。靠近时紧张，远离时想念。',
                risks: '关系节奏反复拉扯、难以相信有人会稳定陪伴。',
                advice: '尝试把"我现在在怕什么"说清楚，而不是只表现为冷淡或抓紧。'
            },
            'MixAnxious': {
                title: '偏焦虑混合型',
                subtitle: '你的依恋模式偏向焦虑一侧',
                portrait: '你的依恋模式中，同时带着焦虑和回避的特征，但在关键时刻更容易偏向焦虑一侧。',
                risks: '在不安全时容易过度担心失去对方。',
                advice: '关注长期行为而非猜测，建立关系外的支撑系统。'
            },
            'MixAvoidant': {
                title: '偏回避混合型',
                subtitle: '你的依恋模式偏向回避一侧',
                portrait: '你的依恋模式中，同时带着焦虑和回避的特征，但在关键时刻更容易偏向回避一侧。',
                risks: '在感觉被控制时会想要逃离。',
                advice: '提前和对方约定"我现在需要一点自己的时间，XX点之后我会回来和你聊。"'
            },
            'MixComplex': {
                title: '混合复杂型',
                subtitle: '你的依恋模式比较复杂',
                portrait: '你的依恋模式较为复杂，会在不同情境下切换不同的状态。',
                risks: '关系模式不够稳定，容易让自己和对方都感到困惑。',
                advice: '先学会观察自己在什么情况下会偏向焦虑，什么情况下会偏向回避。'
            }
        },
        boundary: {
            'High': '你在关系中的界限感整体比较健康。你能区分"我想要的"和"对方期待我做的"。',
            'Mid': '你的界限感处在一个"忽好忽弱"的状态。当对方态度温和时，你能讲出自己的想法。',
            'Low': '你在关系中容易为了维持和谐，而牺牲自己的感受。建议在日常小事里先练习说"不"。'
        },
        selfWorth: {
            'High': '在亲密关系里，你的自我价值感比较容易被动摇。一点点拒绝、冷淡，都会触发"是不是我不够好"的想法。',
            'Mid': '你的自我价值感整体还可以，但在特别在意的人面前会明显变得脆弱。',
            'Low': '在关系中，你对自己的整体评价比较稳定。即便遇到冲突或被拒绝，你也能把那理解为"双方不合适/事情本身的问题"。'
        }
    };
}
