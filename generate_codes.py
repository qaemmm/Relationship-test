#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
兑换码批量生成工具
用于生成唯一的8位兑换码，便于小红书自动发货
"""

import random
import string
import json
import csv
from datetime import datetime
import argparse

def generate_code(length=8, exclude_chars='0O1I'):
    """
    生成随机兑换码
    
    Args:
        length: 兑换码长度，默认8位
        exclude_chars: 排除易混淆字符，默认排除 0O1I
    
    Returns:
        8位大写字母数字组合的兑换码
    """
    chars = string.ascii_uppercase + string.digits
    # 排除易混淆字符
    chars = ''.join(c for c in chars if c not in exclude_chars)
    return ''.join(random.choices(chars, k=length))

def batch_generate(count=100, length=8, batch_name=None):
    """
    批量生成兑换码
    
    Args:
        count: 生成数量
        length: 兑换码长度
        batch_name: 批次名称
    
    Returns:
        兑换码列表（字典格式）
    """
    codes = {}
    used_codes = set()
    
    if not batch_name:
        batch_name = f"batch_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    while len(codes) < count:
        code = generate_code(length)
        if code not in used_codes:
            used_codes.add(code)
            codes[code] = {
                'used': False,
                'createdAt': datetime.now().isoformat(),
                'batch': batch_name
            }
    
    return codes

def save_to_json(codes, filename):
    """保存为JSON格式"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(codes, f, ensure_ascii=False, indent=2)
    print(f"✅ JSON文件已保存: {filename}")

def save_to_csv(codes, filename):
    """保存为CSV格式（便于导入发货系统）"""
    with open(filename, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['兑换码', '生成时间', '批次', '状态'])
        for code, data in codes.items():
            writer.writerow([
                code,
                data['createdAt'],
                data['batch'],
                '未使用' if not data['used'] else '已使用'
            ])
    print(f"✅ CSV文件已保存: {filename}")

def save_to_txt(codes, filename):
    """保存为纯文本格式（每行一个兑换码）"""
    with open(filename, 'w', encoding='utf-8') as f:
        for code in codes.keys():
            f.write(f"{code}\n")
    print(f"✅ TXT文件已保存: {filename}")

def main():
    parser = argparse.ArgumentParser(description='批量生成兑换码')
    parser.add_argument('--count', type=int, default=100, help='生成数量（默认100）')
    parser.add_argument('--length', type=int, default=8, help='兑换码长度（默认8）')
    parser.add_argument('--batch', type=str, help='批次名称（默认自动生成）')
    parser.add_argument('--output', type=str, default='codes', help='输出文件名前缀（默认codes）')
    args = parser.parse_args()
    
    print(f"🚀 开始生成 {args.count} 个兑换码...")
    print(f"📝 兑换码长度: {args.length} 位")
    if args.batch:
        print(f"📦 批次名称: {args.batch}")
    
    # 生成兑换码
    codes = batch_generate(
        count=args.count,
        length=args.length,
        batch_name=args.batch
    )
    
    # 生成文件名
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    json_file = f"{args.output}_{timestamp}.json"
    csv_file = f"{args.output}_{timestamp}.csv"
    txt_file = f"{args.output}_{timestamp}.txt"
    
    # 保存文件
    save_to_json(codes, json_file)
    save_to_csv(codes, csv_file)
    save_to_txt(codes, txt_file)
    
    print(f"\n✨ 成功生成 {len(codes)} 个兑换码！")
    print(f"📁 文件列表:")
    print(f"   - {json_file} (用于导入系统)")
    print(f"   - {csv_file} (用于Excel查看)")
    print(f"   - {txt_file} (纯文本列表)")
    print(f"\n💡 示例兑换码: {list(codes.keys())[:5]}")

if __name__ == '__main__':
    main()
