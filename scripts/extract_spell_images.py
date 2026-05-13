"""
Extrai imagens do Grimório Total v.0.4.xlsx, comprime e gera mapeamento.

Chain de mapeamento:
  cell.vm=N (1-indexed)
    -> valueMetadata[N-1].rc.v = M  (identity: M == N-1)
    -> futureMetadata[M].rvb.i = I  (identity: I == M)
    -> rdrichvalue.rv[I].v[0] = K   (rId index, 0-based)
    -> richValueRel.xml rel[K].r:id = rIdX
    -> _rels/richValueRel.xml.rels rIdX -> media/imageX.jpeg

Saída:
  assets/spell-images/*.jpg        imagens comprimidas ~15KB cada
  data/spell-image-map.json        { "Nome Magia": "nome-magia.jpg" }
"""

import zipfile, json, re, os, io
from xml.etree import ElementTree as ET
from pathlib import Path

XLSX    = Path(__file__).parent.parent / "magic keos" / "Grimório Total v.0.4.xlsx"
OUT_DIR = Path(__file__).parent.parent / "assets" / "spell-images"
MAP_OUT = Path(__file__).parent.parent / "data" / "spell-image-map.json"
MAX_DIM = 280
QUALITY = 72

OUT_DIR.mkdir(parents=True, exist_ok=True)

try:
    from PIL import Image
    PIL_OK = True
except ImportError:
    PIL_OK = False
    print("AVISO: Pillow não encontrado — sem compressão.")

NS_MAIN = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
NS_XLRD = 'http://schemas.microsoft.com/office/spreadsheetml/2017/richdata'
NS_RVR  = 'http://schemas.microsoft.com/office/spreadsheetml/2022/richvaluerel'
NS_R    = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
NS_REL  = 'http://schemas.openxmlformats.org/package/2006/relationships'

def read_entry(zf, path):
    with zf.open(path) as f:
        return ET.parse(f).getroot()

def slug(name: str) -> str:
    s = name.lower().strip()
    for src, dst in [('áàãâä','a'),('éèêë','e'),('íìîï','i'),('óòõôö','o'),('úùûü','u'),('ç','c')]:
        for ch in src: s = s.replace(ch, dst)
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')

def compress_image(data: bytes) -> bytes:
    if not PIL_OK:
        return data
    img = Image.open(io.BytesIO(data)).convert('RGB')
    w, h = img.size
    if max(w, h) > MAX_DIM:
        r = MAX_DIM / max(w, h)
        img = img.resize((int(w*r), int(h*r)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format='JPEG', quality=QUALITY, optimize=True)
    return buf.getvalue()

print(f"Abrindo {XLSX.name}...")
with zipfile.ZipFile(XLSX) as zf:

    # ── 1. richValueRel.xml -> lista ordenada de rIds ─────────────────────────
    rvr_root = read_entry(zf, 'xl/richData/richValueRel.xml')
    # <rel r:id="rId1"/><rel r:id="rId2"/>... em ordem
    ordered_rids = [rel.get(f'{{{NS_R}}}id') for rel in rvr_root.findall(f'{{{NS_RVR}}}rel')]
    print(f"richValueRel.xml: {len(ordered_rids)} rels em ordem")
    print(f"  Primeiros: {ordered_rids[:5]}")

    # ── 2. _rels/richValueRel.xml.rels -> rId -> caminho do arquivo ────────────
    rels_root = read_entry(zf, 'xl/richData/_rels/richValueRel.xml.rels')
    rid_to_file = {}
    for rel in rels_root.findall(f'{{{NS_REL}}}Relationship'):
        rid_to_file[rel.get('Id')] = rel.get('Target').replace('../', 'xl/')
    print(f"_rels: {len(rid_to_file)} mapeamentos rId->arquivo")

    # ── 3. rdrichvalue.xml -> índice rv -> índice em ordered_rids ─────────────
    rdv_root = read_entry(zf, 'xl/richData/rdrichvalue.xml')
    rv_to_rel_idx = {}  # rv_index -> index into ordered_rids
    for i, rv in enumerate(rdv_root.findall(f'{{{NS_XLRD}}}rv')):
        vs = rv.findall(f'{{{NS_XLRD}}}v')
        if vs and vs[0].text is not None:
            rv_to_rel_idx[i] = int(vs[0].text)
    print(f"rdrichvalue: {len(rv_to_rel_idx)} entradas rv->rel_idx")

    # ── 4. sharedStrings.xml ─────────────────────────────────────────────────
    ss_root = read_entry(zf, 'xl/sharedStrings.xml')
    shared = []
    for si in ss_root.findall(f'{{{NS_MAIN}}}si'):
        texts = si.findall(f'.//{{{NS_MAIN}}}t')
        shared.append(''.join(t.text or '' for t in texts))

    # ── 5. sheet1.xml -> row -> (vm, spell_name) ──────────────────────────────
    sheet_root = read_entry(zf, 'xl/worksheets/sheet1.xml')
    row_to_vm = {}    # row_num -> vm value (1-indexed)
    row_to_spell = {} # row_num -> spell name (from col B)

    for row_el in sheet_root.findall(f'.//{{{NS_MAIN}}}row'):
        rn = int(row_el.get('r', 0))
        if rn <= 1:
            continue  # pula header
        for c in row_el.findall(f'{{{NS_MAIN}}}c'):
            col = re.sub(r'\d', '', c.get('r', ''))
            vm = c.get('vm')
            t  = c.get('t')
            v  = c.find(f'{{{NS_MAIN}}}v')

            if col == 'A' and vm is not None:
                row_to_vm[rn] = int(vm)

            if col == 'B' and v is not None and v.text is not None:
                raw = shared[int(v.text)] if t == 's' else v.text
                row_to_spell[rn] = raw.replace('\n', ' ').replace('\r', '').strip()

    print(f"Linhas com imagem (vm): {len(row_to_vm)}")
    print(f"Linhas com nome (col B): {len(row_to_spell)}")

    # ── Debug: tracing row 2 ─────────────────────────────────────────────────
    if 2 in row_to_vm and 2 in row_to_spell:
        vm = row_to_vm[2]
        spell = row_to_spell[2]
        rv_idx = vm - 1  # vm é 1-indexed
        rel_idx = rv_to_rel_idx.get(rv_idx)
        rid = ordered_rids[rel_idx] if rel_idx is not None and rel_idx < len(ordered_rids) else None
        img_path = rid_to_file.get(rid) if rid else None
        print(f"\nTrace row 2: vm={vm} spell='{spell}' rv_idx={rv_idx} rel_idx={rel_idx} rId={rid} path={img_path}")

    # ── 6. Extrair, comprimir, salvar ────────────────────────────────────────
    spell_map = {}
    errors = []
    rows = sorted(set(row_to_vm) & set(row_to_spell))
    print(f"\nProcessando {len(rows)} mágicas...")

    for rn in rows:
        spell = row_to_spell[rn]
        vm    = row_to_vm[rn]
        rv_idx = vm - 1  # 1-indexed -> 0-indexed

        rel_idx = rv_to_rel_idx.get(rv_idx)
        if rel_idx is None:
            errors.append(f"row {rn} ({spell}): rv {rv_idx} não encontrado")
            continue

        if rel_idx >= len(ordered_rids):
            errors.append(f"row {rn} ({spell}): rel_idx {rel_idx} fora do range ({len(ordered_rids)})")
            continue

        rid = ordered_rids[rel_idx]
        img_path = rid_to_file.get(rid)
        if img_path is None:
            errors.append(f"row {rn} ({spell}): rId '{rid}' sem arquivo")
            continue

        try:
            img_data = zf.read(img_path)
            compressed = compress_image(img_data)
            filename = slug(spell) + '.jpg'
            (OUT_DIR / filename).write_bytes(compressed)
            spell_map[spell] = filename
        except Exception as e:
            errors.append(f"row {rn} ({spell}): {e}")

    print(f"Imagens salvas: {len(spell_map)}")
    if errors:
        print(f"Erros ({len(errors)}):")
        for e in errors[:15]:
            print(f"  {e}")

    MAP_OUT.write_text(json.dumps(spell_map, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f"\nMapeamento salvo em: {MAP_OUT.name}")

    saved = list(OUT_DIR.glob('*.jpg'))
    total_mb = sum(f.stat().st_size for f in saved) / (1024*1024)
    print(f"Tamanho total: {total_mb:.1f} MB ({len(saved)} arquivos)")
    if saved:
        avg_kb = total_mb * 1024 / len(saved)
        print(f"Média por imagem: {avg_kb:.1f} KB")
