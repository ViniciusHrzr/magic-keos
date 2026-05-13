import json
from pathlib import Path

MAP = Path(__file__).parent.parent / 'data' / 'spell-image-map.json'
OUT = Path(__file__).parent.parent / 'data' / 'spellImages.ts'

spell_map = json.loads(MAP.read_text(encoding='utf-8'))

lines = ['// Auto-gerado por scripts/generate_image_map.py\n']
lines.append('const spellImages: Record<string, any> = {\n')
for name, filename in sorted(spell_map.items(), key=lambda x: x[0]):
    clean = name.replace('\n', ' ').replace('\r', '').replace('\\', '\\\\').replace('"', '\\"')
    lines.append(f'  "{clean}": require("../assets/spell-images/{filename}"),\n')
lines.append('};\n\nexport default spellImages;\n')

OUT.write_text(''.join(lines), encoding='utf-8')
print(f'Gerado: {OUT.name} com {len(spell_map)} entradas')
