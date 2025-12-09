// 兑换码验证逻辑（纯前端方案）

// 从 codes.json 加载兑换码数据
let codesDatabase = null;

// 加载兑换码数据库
async function loadCodesDatabase() {
    if (codesDatabase) return codesDatabase;

    try {
        const response = await fetch('data/codes.json');
        codesDatabase = await response.json();
        return codesDatabase;
    } catch (error) {
        console.error('加载兑换码数据失败:', error);
        // 返回默认测试码
        return {
            'TEST2024': { used: false, createdAt: '2025-12-09' },
            'LOVE123': { used: false, createdAt: '2025-12-09' },
            'DEMO2025': { used: false, createdAt: '2025-12-09' }
        };
    }
}

// 获取已使用的兑换码列表（从LocalStorage）
function getUsedCodes() {
    const used = localStorage.getItem('usedCodes');
    return used ? JSON.parse(used) : [];
}

// 标记兑换码为已使用
function markCodeAsUsed(code) {
    const usedCodes = getUsedCodes();
    if (!usedCodes.includes(code)) {
        usedCodes.push(code);
        localStorage.setItem('usedCodes', JSON.stringify(usedCodes));
    }
}

// 验证兑换码
async function verifyRedemptionCode(code) {
    // 加载兑换码数据库
    const db = await loadCodesDatabase();

    // 检查兑换码是否存在
    if (!db[code]) {
        return {
            success: false,
            message: '兑换码不存在，请检查后重试'
        };
    }

    // 检查是否已在此设备使用过
    const usedCodes = getUsedCodes();
    if (usedCodes.includes(code)) {
        return {
            success: false,
            message: '此兑换码已在本设备使用过'
        };
    }

    // 检查是否在数据库中标记为已使用（全局状态，可选）
    if (db[code].used) {
        return {
            success: false,
            message: '此兑换码已被使用'
        };
    }

    // 验证成功，标记为已使用
    markCodeAsUsed(code);

    // 更新数据库状态（仅本地，前端方案的局限性）
    db[code].used = true;
    db[code].usedAt = new Date().toISOString();

    return {
        success: true,
        message: '验证成功',
        code: code
    };
}

// 检查兑换码格式
function validateCodeFormat(code) {
    // 8位字母数字组合
    const pattern = /^[A-Z0-9]{8}$/;
    return pattern.test(code);
}
