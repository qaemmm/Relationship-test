#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
兑换码导入工具
将生成的兑换码批次导入到 data/codes.json
"""

import json
import sys
import os

def import_codes(source_file):
    """导入兑换码到 data/codes.json"""
    
    # 检查源文件是否存在
    if not os.path.exists(source_file):
        print(f"❌ 错误：文件 {source_file} 不存在")
        return False
    
    # 读取新生成的兑换码
    print(f"📂 读取新兑换码: {source_file}")
    with open(source_file, 'r', encoding='utf-8') as f:
        new_codes = json.load(f)
    
    print(f"✅ 读取成功，共 {len(new_codes)} 个兑换码")
    
    # 读取现有数据库
    existing = {}
    if os.path.exists('data/codes.json'):
        try:
            with open('data/codes.json', 'r', encoding='utf-8') as f:
                existing = json.load(f)
            print(f"📊 现有兑换码: {len(existing)} 个")
        except:
            print("⚠️ 原有 data/codes.json 为空或格式错误，将创建新文件")
    else:
        print("📝 data/codes.json 不存在，将创建新文件")
    
    # 合并（新码会覆盖旧码）
    existing.update(new_codes)
    
    # 确保 data 目录存在
    os.makedirs('data', exist_ok=True)
    
    # 写回
    with open('data/codes.json', 'w', encoding='utf-8') as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)
    
    print(f"\n✨ 导入完成！")
    print(f"📊 总计兑换码数量: {len(existing)} 个")
    print(f"📁 已保存到: data/codes.json")
    
    # 显示前5个兑换码作为示例
    sample_codes = list(existing.keys())[:5]
    print(f"\n💡 示例兑换码:")
    for code in sample_codes:
        status = "已使用" if existing[code].get('used', False) else "未使用"
        print(f"   - {code} ({status})")
    
    return True

if __name__ == '__main__':
    if len(sys.argv) > 1:
        source_file = sys.argv[1]
    else:
        # 默认导入最新的批次
        source_file = 'codes_20251209_180435.json'
    
    success = import_codes(source_file)
    sys.exit(0 if success else 1)
