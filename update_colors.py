#!/usr/bin/env python3
"""
Script to simplify color scheme in docs page for light mode.
Light mode: Uses neutral colors (black, gray, blue accent)
Dark mode: Keeps all vibrant colors
"""

import re

def update_colors(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    # Track changes
    changes = []

    # 1. Icon colors - Simplify to gray in light mode
    icon_colors = [
        ('text-blue-400', 'text-black/60 dark:text-blue-400'),
        ('text-green-400', 'text-black/60 dark:text-green-400'),
        ('text-purple-400', 'text-black/60 dark:text-purple-400'),
        ('text-yellow-400', 'text-black/60 dark:text-yellow-400'),
        ('text-pink-400', 'text-black/60 dark:text-pink-400'),
        ('text-cyan-400', 'text-black/60 dark:text-cyan-400'),
        ('text-red-400', 'text-black/60 dark:text-red-400'),
        ('text-orange-400', 'text-black/60 dark:text-orange-400'),
    ]

    for old, new in icon_colors:
        # Skip if already has dark: variant
        pattern = rf'(?<!dark:){re.escape(old)}(?!\s+dark:)'
        matches = len(re.findall(pattern, content))
        if matches > 0:
            content = re.sub(pattern, new, content)
            changes.append(f"  {old} -> {new} ({matches} occurrences)")

    # 2. Number/stat displays - Most become blue-600, red stays black/70
    # Look for font-black or font-bold followed by color classes
    number_patterns = [
        (r'(text-2xl|text-3xl|text-4xl)([^"]*?)(font-black|font-bold)([^"]*?)text-blue-400',
         r'\1\2\3\4text-blue-600 dark:text-blue-400'),
        (r'(text-2xl|text-3xl|text-4xl)([^"]*?)(font-black|font-bold)([^"]*?)text-green-400',
         r'\1\2\3\4text-blue-600 dark:text-green-400'),
        (r'(text-2xl|text-3xl|text-4xl)([^"]*?)(font-black|font-bold)([^"]*?)text-purple-400',
         r'\1\2\3\4text-blue-600 dark:text-purple-400'),
        (r'(text-2xl|text-3xl|text-4xl)([^"]*?)(font-black|font-bold)([^"]*?)text-yellow-400',
         r'\1\2\3\4text-blue-600 dark:text-yellow-400'),
        (r'(text-2xl|text-3xl|text-4xl)([^"]*?)(font-black|font-bold)([^"]*?)text-red-400',
         r'\1\2\3\4text-black/70 dark:text-red-400'),
    ]

    for pattern, replacement in number_patterns:
        matches = len(re.findall(pattern, content))
        if matches > 0:
            content = re.sub(pattern, replacement, content)
            changes.append(f"  Number pattern: {pattern[:30]}... ({matches} occurrences)")

    # 3. Background gradients - Neutral in light, colorful in dark
    bg_gradients = [
        ('from-blue-500/20', 'from-black/5 dark:from-blue-500/20'),
        ('to-cyan-500/20', 'to-black/5 dark:to-cyan-500/20'),
        ('to-purple-500/20', 'to-black/5 dark:to-purple-500/20'),
        ('from-green-500/20', 'from-black/5 dark:from-green-500/20'),
        ('to-emerald-500/20', 'to-black/5 dark:to-emerald-500/20'),
        ('from-purple-500/20', 'from-black/5 dark:from-purple-500/20'),
        ('to-pink-500/20', 'to-black/5 dark:to-pink-500/20'),
        ('from-yellow-500/20', 'from-black/5 dark:from-yellow-500/20'),
        ('to-orange-500/20', 'to-black/5 dark:to-orange-500/20'),
        ('from-red-500/20', 'from-black/5 dark:from-red-500/20'),
        ('from-cyan-500/20', 'from-black/5 dark:from-cyan-500/20'),
    ]

    for old, new in bg_gradients:
        pattern = rf'(?<!dark:){re.escape(old)}(?!\s+dark:)'
        matches = len(re.findall(pattern, content))
        if matches > 0:
            content = re.sub(pattern, new, content)
            changes.append(f"  {old} -> {new} ({matches} occurrences)")

    # 4. Border colors - Neutral in light mode
    border_colors = [
        ('border-blue-500/30', 'border-black/10 dark:border-blue-500/30'),
        ('border-green-500/30', 'border-black/10 dark:border-green-500/30'),
        ('border-purple-500/30', 'border-black/10 dark:border-purple-500/30'),
        ('border-yellow-500/30', 'border-black/10 dark:border-yellow-500/30'),
        ('border-red-500/30', 'border-black/10 dark:border-red-500/30'),
        ('border-cyan-500/30', 'border-black/10 dark:border-cyan-500/30'),
        ('border-pink-500/30', 'border-black/10 dark:border-pink-500/30'),
        ('border-orange-500/30', 'border-black/10 dark:border-orange-500/30'),
        ('border-blue-500/20', 'border-black/10 dark:border-blue-500/20'),
        ('border-green-500/20', 'border-black/10 dark:border-green-500/20'),
        ('border-purple-500/20', 'border-black/10 dark:border-purple-500/20'),
        ('border-yellow-500/20', 'border-black/10 dark:border-yellow-500/20'),
        ('border-red-500/20', 'border-black/10 dark:border-red-500/20'),
        ('border-cyan-500/20', 'border-black/10 dark:border-cyan-500/20'),
    ]

    for old, new in border_colors:
        pattern = rf'(?<!dark:){re.escape(old)}(?!\s+dark:)'
        matches = len(re.findall(pattern, content))
        if matches > 0:
            content = re.sub(pattern, new, content)
            changes.append(f"  {old} -> {new} ({matches} occurrences)")

    # 5. Code/mono text colors
    code_colors = [
        ('text-blue-300', 'text-black/70 dark:text-blue-300'),
        ('text-green-300', 'text-black/70 dark:text-green-300'),
        ('text-cyan-300', 'text-black/70 dark:text-cyan-300'),
        ('text-purple-300', 'text-black/70 dark:text-purple-300'),
        ('text-yellow-300', 'text-black/70 dark:text-yellow-300'),
        ('text-red-300', 'text-black/70 dark:text-red-300'),
        ('text-pink-300', 'text-black/70 dark:text-pink-300'),
    ]

    for old, new in code_colors:
        pattern = rf'(?<!dark:){re.escape(old)}(?!\s+dark:)'
        matches = len(re.findall(pattern, content))
        if matches > 0:
            content = re.sub(pattern, new, content)
            changes.append(f"  {old} -> {new} ({matches} occurrences)")

    # Write back
    with open(file_path, 'w') as f:
        f.write(content)

    return changes

if __name__ == '__main__':
    file_path = '/Users/goktugkarabulut/Documents/gitcheck/app/docs/page.tsx'
    print("Updating color scheme in docs page...")
    print("Light mode: Neutral colors (black, gray, blue accent)")
    print("Dark mode: Vibrant colors preserved\n")

    changes = update_colors(file_path)

    print(f"✓ Applied {len(changes)} color transformations:")
    for change in changes:
        print(change)

    print(f"\n✓ File updated: {file_path}")
