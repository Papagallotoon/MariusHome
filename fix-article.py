#!/usr/bin/env python3
"""Restructure the 'erreurs' article: remove 'Erreur #X' from titles,
wrap each error in a styled card with Problem/Solution sections."""
import json, re

filepath = r'C:\Users\Sauce deluxe\OneDrive\Bureau\APP\Site\Afilliate 2\deco-site\content\articles\erreurs-decoration-interieure-eviter.json'

with open(filepath, 'r', encoding='utf-8') as f:
    data = json.load(f)

old_content = data['content']

# Parse each error block: <h2>Erreur #N : Title</h2><p><strong>Le problème :</strong> text</p><p><strong>La solution :</strong> text</p>
# Also handle <hr> separators between groups

# Split by <h2> tags
parts = re.split(r'(<h2>)', old_content)

new_content = ''
card_num = 0

i = 0
while i < len(parts):
    part = parts[i]

    if part == '<h2>':
        # Get the heading content (next part until </h2>)
        i += 1
        heading_and_rest = parts[i]

        # Extract heading text
        h2_match = re.match(r'(.*?)</h2>(.*)', heading_and_rest, re.DOTALL)
        if not h2_match:
            new_content += '<h2>' + heading_and_rest
            i += 1
            continue

        heading_text = h2_match.group(1)
        after_heading = h2_match.group(2)

        # Check if this is an "Erreur #X" heading
        erreur_match = re.match(r'Erreur\s*#(\d+)\s*:\s*(.*)', heading_text)

        if erreur_match:
            num = erreur_match.group(1)
            title = erreur_match.group(2)
            card_num += 1

            # Extract problem and solution from the text after heading
            # Pattern: <p><strong>Le problème :</strong> TEXT</p><p><strong>La solution :</strong> TEXT</p>
            problem_match = re.search(
                r'<p><strong>Le problème\s*:?\s*</strong>\s*(.*?)</p>',
                after_heading, re.DOTALL
            )
            solution_match = re.search(
                r'<p><strong>La solution\s*:?\s*</strong>\s*(.*?)</p>',
                after_heading, re.DOTALL
            )

            problem_text = problem_match.group(1).strip() if problem_match else ''
            solution_text = solution_match.group(1).strip() if solution_match else ''

            # Build the card
            card = (
                f'<div class="deco-tip">'
                f'<h2 class="deco-tip-title">'
                f'<span class="deco-tip-num">{num}</span>'
                f'{title}'
                f'</h2>'
                f'<div class="deco-tip-problem">'
                f'<h3>Le probl\u00e8me</h3>'
                f'<p>{problem_text}</p>'
                f'</div>'
                f'<div class="deco-tip-solution">'
                f'<h3>La solution</h3>'
                f'<p>{solution_text}</p>'
                f'</div>'
                f'</div>'
            )
            new_content += card

        elif 'résumé' in heading_text.lower() or 'règles' in heading_text.lower():
            # Keep the summary section as-is but with clean heading
            new_content += f'<h2>{heading_text}</h2>{after_heading}'
        else:
            # Any other h2, keep as-is
            new_content += f'<h2>{heading_text}</h2>{after_heading}'
    else:
        # Remove standalone <hr> tags (no longer needed with cards)
        cleaned = re.sub(r'<hr\s*/?>', '', part)
        new_content += cleaned

    i += 1

# Clean up any remaining <hr> tags
new_content = re.sub(r'<hr\s*/?>', '', new_content)

data['content'] = new_content

with open(filepath, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"[OK] Content restructured")
print(f"  Old length: {len(old_content)}")
print(f"  New length: {len(new_content)}")
print(f"  Cards created: {card_num}")

# Verify the structure
h2_count = new_content.count('<h2')
tip_count = new_content.count('deco-tip-num')
problem_count = new_content.count('deco-tip-problem')
solution_count = new_content.count('deco-tip-solution')
erreur_count = new_content.count('Erreur #')

print(f"  H2 tags: {h2_count}")
print(f"  Tip numbers: {tip_count}")
print(f"  Problem sections: {problem_count}")
print(f"  Solution sections: {solution_count}")
print(f"  'Erreur #' remaining: {erreur_count}")
