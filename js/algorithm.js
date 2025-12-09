// 核心算法：计算依恋类型
class AttachmentCalculator {
    constructor(answers) {
        this.answers = answers;
        this.scores = {
            A: 0,  // 依恋焦虑
            B: 0,  // 依恋回避
            C: 0,  // 界限感
            D: 0   // 自我价值脆弱度
        };
        this.levels = {};
        this.attachmentType = '';
    }

    // 反向计分题号
    get reversedQuestions() {
        return [5, 6, 11, 12, 14, 16, 18];
    }

    // 获取处理后的分数
    getProcessedScore(questionId, rawScore) {
        if (this.reversedQuestions.includes(questionId)) {
            return 6 - rawScore;
        }
        return rawScore;
    }

    // 计算维度得分
    calculateDimensions() {
        // A 维度 (题号 1-6)
        let aSum = 0;
        for (let i = 1; i <= 6; i++) {
            aSum += this.getProcessedScore(i, this.answers[i]);
        }
        this.scores.A = parseFloat((aSum / 6).toFixed(1));

        // B 维度 (题号 7-12)
        let bSum = 0;
        for (let i = 7; i <= 12; i++) {
            bSum += this.getProcessedScore(i, this.answers[i]);
        }
        this.scores.B = parseFloat((bSum / 6).toFixed(1));

        // C 维度 (题号 13-18)
        let cSum = 0;
        for (let i = 13; i <= 18; i++) {
            cSum += this.getProcessedScore(i, this.answers[i]);
        }
        this.scores.C = parseFloat((cSum / 6).toFixed(1));

        // D 维度 (题号 19-24)
        let dSum = 0;
        for (let i = 19; i <= 24; i++) {
            dSum += this.getProcessedScore(i, this.answers[i]);
        }
        this.scores.D = parseFloat((dSum / 6).toFixed(1));
    }

    // 判定等级
    getLevel(score) {
        if (score <= 2.4) return 'Low';
        if (score <= 3.5) return 'Mid';
        return 'High';
    }

    // 计算等级
    calculateLevels() {
        this.levels.A = this.getLevel(this.scores.A);
        this.levels.B = this.getLevel(this.scores.B);
        this.levels.C = this.getLevel(this.scores.C);
        this.levels.D = this.getLevel(this.scores.D);
    }

    // 判定依恋类型
    determineAttachmentType() {
        const A = this.levels.A;
        const B = this.levels.B;
        const avgA = this.scores.A;
        const avgB = this.scores.B;

        // 优先级1: 安全型
        if (A === 'Low' && B === 'Low') {
            this.attachmentType = 'Secure';
            return;
        }

        // 优先级2: 恐惧-回避型
        if (A === 'High' && B === 'High') {
            this.attachmentType = 'Fearful';
            return;
        }

        // 优先级3: 焦虑型
        if (A === 'High' && B !== 'High') {
            this.attachmentType = 'Anxious';
            return;
        }

        // 优先级4: 回避型
        if (B === 'High' && A !== 'High') {
            this.attachmentType = 'Avoidant';
            return;
        }

        // 优先级5: 偏焦虑混合型
        if (avgA > avgB) {
            this.attachmentType = 'MixAnxious';
            return;
        }

        // 优先级6: 偏回避混合型
        if (avgB > avgA) {
            this.attachmentType = 'MixAvoidant';
            return;
        }

        // 优先级7: 混合复杂型
        if (Math.abs(avgA - avgB) <= 0.3) {
            this.attachmentType = 'MixComplex';
            return;
        }

        // 兜底
        this.attachmentType = 'MixComplex';
    }

    // 执行完整计算
    calculate() {
        this.calculateDimensions();
        this.calculateLevels();
        this.determineAttachmentType();

        return {
            scores: this.scores,
            levels: this.levels,
            attachmentType: this.attachmentType
        };
    }
}

// 导出函数供其他页面使用
function calculateAttachment(answers) {
    const calculator = new AttachmentCalculator(answers);
    return calculator.calculate();
}
