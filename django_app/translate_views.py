import os
import libcst as cst
from deep_translator import GoogleTranslator

def translate_text_preserve_spaces(text):
    if not text.strip(): return text
    leading = text[:len(text) - len(text.lstrip())]
    trailing = text[len(text.rstrip()):]
    stripped = text.strip()
    try:
        translated = GoogleTranslator(source='es', target='en').translate(stripped)
        return leading + (translated if translated else stripped) + trailing
    except Exception as e:
        print(f"Translation failed for '{text}': {e}")
        return text

class TranslateStrings(cst.CSTTransformer):
    def leave_DictElement(self, original_node: cst.DictElement, updated_node: cst.DictElement) -> cst.DictElement:
        key_is_target = False
        if isinstance(updated_node.key, cst.SimpleString):
            try:
                val = updated_node.key.evaluated_value
                if val in ["error", "message"]:
                    key_is_target = True
            except:
                pass
                
        if not key_is_target:
            return updated_node
            
        value = updated_node.value
        if isinstance(value, cst.SimpleString):
            eval_val = value.evaluated_value
            if not eval_val.strip():
                return updated_node
            translated_inner = translate_text_preserve_spaces(eval_val)
            
            new_str = repr(translated_inner)
            # libcst requires a valid string for SimpleString.
            return updated_node.with_changes(value=value.with_changes(value=new_str))
            
        elif isinstance(value, cst.FormattedString):
            new_parts = []
            for part in value.parts:
                if isinstance(part, cst.FormattedStringText):
                    if not part.value.strip():
                        new_parts.append(part)
                    else:
                        translated_inner = translate_text_preserve_spaces(part.value)
                        new_parts.append(part.with_changes(value=translated_inner))
                else:
                    new_parts.append(part)
            return updated_node.with_changes(value=value.with_changes(parts=new_parts))
            
        return updated_node

base_dir = r'c:\Users\ASUS\Documents\safecity_project\django_app'
files_to_check = [
    r'administracion_seguridad\views.py',
    r'gestion_operativa\emergency_views.py',
    r'gestion_operativa\operativa_views.py',
    r'gestion_operativa\views.py',
    r'inteligencia_criminal\views.py',
    r'investigacion_especial\views.py',
    r'logistica_patrullaje\views.py',
    r'operativo_rrhh\views.py',
    r'ordenes_judiciales\views.py',
]

for rel_file in files_to_check:
    filepath = os.path.join(base_dir, rel_file)
    if not os.path.exists(filepath):
        print(f"Not found: {filepath}")
        continue
    print(f"Processing {rel_file}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        source_code = f.read()
    
    try:
        module = cst.parse_module(source_code)
    except Exception as e:
        print(f"Failed to parse {rel_file}: {e}")
        continue
        
    transformer = TranslateStrings()
    modified_module = module.visit(transformer)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(modified_module.code)
    print(f"Successfully processed {rel_file}")
