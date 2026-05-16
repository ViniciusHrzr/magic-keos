#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generate-game-rules.py — Gera .planning/GAME_RULES.md a partir do docx v0.4

Uso:
  python scripts/generate-game-rules.py

Gera:
  .planning/GAME_RULES.md — documento de referência para narradores
"""

import sys
import os
sys.stdout.reconfigure(encoding='utf-8')
from docx import Document

DOCX_PATH = "magic keos/Magic no Universo Kéos v.0.4.docx"
OUTPUT_PATH = ".planning/GAME_RULES.md"


def extract_full_content(path):
    doc = Document(path)
    sections = []
    current_section = []

    for element in doc.element.body:
        tag = element.tag.split('}')[-1]
        if tag == 'p':
            from docx.oxml.ns import qn
            text = ''.join(node.text or '' for node in element.iter(qn('w:t')))
            if text.strip():
                current_section.append(('p', text.strip()))
        elif tag == 'tbl':
            if current_section:
                sections.append(current_section)
            table_data = []
            ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
            for tr in element.iter(f'{{{ns}}}tr'):
                row = []
                for tc in tr.iter(f'{{{ns}}}tc'):
                    cell_text = ''.join(t.text or '' for t in tc.iter(f'{{{ns}}}t'))
                    row.append(cell_text.strip())
                if any(row):
                    table_data.append(row)
            sections.append([('table', table_data)])
            current_section = []

    if current_section:
        sections.append(current_section)

    return sections


def render_markdown(sections):
    lines = [
        "# Magic no Universo Kéos — Game Rules",
        "",
        "> Gerado por `scripts/generate-game-rules.py` a partir de `Magic no Universo Kéos v.0.4.docx`",
        "> **NAO editar manualmente** — edite data/regras/ e regenere.",
        "",
    ]

    for section in sections:
        for item_type, content in section:
            if item_type == 'p':
                lines.append(content)
                lines.append("")
            elif item_type == 'table':
                if not content:
                    continue
                header = content[0]
                lines.append("| " + " | ".join(header) + " |")
                lines.append("| " + " | ".join(["---"] * len(header)) + " |")
                for row in content[1:]:
                    while len(row) < len(header):
                        row.append("")
                    lines.append("| " + " | ".join(row[:len(header)]) + " |")
                lines.append("")

    return "\n".join(lines)


def main():
    if not os.path.exists(DOCX_PATH):
        print(f"ERRO: DOCX nao encontrado em {DOCX_PATH}")
        sys.exit(2)

    print(f"Lendo {DOCX_PATH}...")
    sections = extract_full_content(DOCX_PATH)

    print(f"Gerando {OUTPUT_PATH}...")
    content = render_markdown(sections)

    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"OK: {OUTPUT_PATH} gerado ({len(content)} chars, {content.count(chr(10))} linhas)")


if __name__ == "__main__":
    main()
