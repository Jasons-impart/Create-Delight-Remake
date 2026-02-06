
import os
import re
import sys
import argparse
import base64
import requests
import xml.etree.ElementTree as ET

# Configuration
CONTRIB_ROCKS_URL = "https://contrib.rocks/image?repo=Jasons-impart/Create-Delight-Remake"
SNBT_PATH = "config/ftbquests/quests/chapters/Acknowledgement.snbt"
ASSETS_DIR = "kubejs/assets/createdelight/textures/gui/contributors"
PLACEHOLDER_IMAGE = "createdelight:textures/gui/qd_windy.png"
FRAME_IMAGE = "vintageimprovements:block/andesite_frame"

# Grid Configuration
START_X = -5.0
START_Y = -13.5
ITEMS_PER_ROW = 20
ITEM_WIDTH = 4.0
ITEM_HEIGHT = 4.0
FRAME_WIDTH = 4.6
FRAME_HEIGHT = 4.6
SPACING_X = 1.0 
STEP_X = 5.0
STEP_Y = 6.0

def ensure_dir(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

def fetch_contributors():
    print(f"Fetching contributors from {CONTRIB_ROCKS_URL}...")
    response = requests.get(CONTRIB_ROCKS_URL)
    response.raise_for_status()
    svg_content = response.text
    
    contributors = []
    
    try:
        root = ET.fromstring(svg_content)
    except ET.ParseError as e:
        print(f"Error parsing SVG: {e}")
        sys.exit(1)
        
    def strip_ns(tag):
        return tag.split('}', 1)[1] if '}' in tag else tag
        
    for child in root:
        if strip_ns(child.tag) == 'svg':
            username = None
            image_data = None
            
            for sub in child:
                if strip_ns(sub.tag) == 'title':
                    username = sub.text
                if strip_ns(sub.tag) == 'defs':
                    for pattern in sub:
                         if strip_ns(pattern.tag) == 'pattern':
                             for img in pattern:
                                 if strip_ns(img.tag) == 'image':
                                     attribs = img.attrib
                                     for k, v in attribs.items():
                                         if k.endswith('href'):
                                             image_data = v
                                             break
            
            if username and image_data:
                contributors.append({'name': username, 'image': image_data})
                
    print(f"Found {len(contributors)} contributors.")
    return contributors

def process_contributors(contributors):
    """Pre-process contributors to add paths and URLs."""
    for c in contributors:
        name = c['name']
        safe_name = re.sub(r'[^a-zA-Z0-9_-]', '_', name).lower()
        c['safe_name'] = safe_name
        c['texture_path'] = f"createdelight:textures/gui/contributors/{safe_name}.png"
        c['profile_url'] = f"https://github.com/{name}"

def save_images(contributors, dest_dir):
    ensure_dir(dest_dir)
    saved_count = 0
    for c in contributors:
        name = c['name']
        data_uri = c['image']
        safe_name = c['safe_name']
        file_path = os.path.join(dest_dir, f"{safe_name}.png")
        
        try:
            # Handle Base64 (PNG, JPEG, etc.)
            if data_uri.startswith('data:image/'):
                header, b64_data = data_uri.split(';base64,', 1)
                img_bytes = base64.b64decode(b64_data)
                with open(file_path, 'wb') as f:
                    f.write(img_bytes)
                saved_count += 1
            
            # Handle HTTP URLs (e.g., GitHub avatars)
            elif data_uri.startswith('http'):
                print(f"Downloading image for {name} from {data_uri}...")
                img_response = requests.get(data_uri)
                img_response.raise_for_status()
                with open(file_path, 'wb') as f:
                    f.write(img_response.content)
                saved_count += 1
            else:
                print(f"Skipping {name}, unknown image data format: {data_uri[:30]}...")
                
        except Exception as e:
            print(f"Failed to save image for {name}: {e}")
            
    print(f"Saved {saved_count} images.")

def generate_snbt_snippet(contributors, is_placeholder=False):
    snippet = ""
    
    count = len(contributors)
    if is_placeholder:
        count = 10
        
    for i in range(count):
        row = i // ITEMS_PER_ROW
        col = i % ITEMS_PER_ROW
        
        current_x = START_X + (col * STEP_X)
        current_y = START_Y + (row * STEP_Y)
        
        if is_placeholder:
            img_path = PLACEHOLDER_IMAGE
            hover_text = "Placeholder - dev版本占位"
            click_action = ""
        else:
            img_path = contributors[i].get('texture_path', PLACEHOLDER_IMAGE)
            hover_text = contributors[i]['name']
            click_action = f'			click: "{contributors[i]["profile_url"]}"\n'
            
        # Image Entry
        snippet += "		{\n"
        snippet += f"{click_action}"
        snippet += f"			height: {ITEM_HEIGHT}d\n"
        snippet += f"			image: \"{img_path}\"\n"
        snippet += "			rotation: 0.0d\n"
        snippet += f"			width: {ITEM_WIDTH}d\n"
        snippet += f"			x: {current_x}d\n"
        snippet += f"			y: {current_y}d\n"
        snippet += "		}\n"
        
        # Frame Entry
        snippet += "		{\n"
        snippet += f"{click_action}"
        snippet += f"			height: {FRAME_HEIGHT}d\n"
        snippet += f"			hover: [\"{hover_text}\"]\n"
        snippet += f"			image: \"{FRAME_IMAGE}\"\n"
        snippet += "			rotation: 0.0d\n"
        snippet += f"			width: {FRAME_WIDTH}d\n"
        snippet += f"			x: {current_x}d\n"
        snippet += f"			y: {current_y}d\n"
        snippet += "		}\n"
        
    return snippet

def update_snbt(snippet):
    if not os.path.exists(SNBT_PATH):
        print(f"Error: SNBT file not found at {SNBT_PATH}")
        sys.exit(1)
        
    with open(SNBT_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
        
    start_marker = "\t\t# AUTO_CONTRIBUTORS_START\n"
    end_marker = "\t\t# AUTO_CONTRIBUTORS_END\n"
    
    pattern = re.compile(r'(\t\t# AUTO_CONTRIBUTORS_START\n.*?\t\t# AUTO_CONTRIBUTORS_END\n)', re.DOTALL)
    
    if pattern.search(content):
        parts = pattern.split(content)
        new_content = parts[0] + start_marker + snippet + end_marker + parts[2]
    else:
        target_str = """		{
			height: 4.0d
			image: "createdelight:textures/gui/qd_windy.png"
			rotation: 0.0d
			width: 4.0d
			x: 12.0d
			y: -6.0d
		}
		{
			height: 4.6d
			image: "vintageimprovements:block/andesite_frame"
			rotation: 0.0d
			width: 4.6d
			x: 12.0d
			y: -6.0d
		}"""
        
        target_str_normalized = target_str.replace("\t", "").replace(" ", "").replace("\n", "")
        
        print("Warning: Could not find markers. Checking for manual intervention needed.")
        sys.exit("Markers not found.")

    with open(SNBT_PATH, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Updated SNBT file.")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--mode', choices=['real', 'placeholder'], required=True)
    parser.add_argument('--download-images', action='store_true')
    args = parser.parse_args()
    
    contributors = []
    if args.mode == 'real':
        contributors = fetch_contributors()
        process_contributors(contributors)
        if args.download_images:
            save_images(contributors, ASSETS_DIR)
        snippet = generate_snbt_snippet(contributors, is_placeholder=False)
    else:
        snippet = generate_snbt_snippet([], is_placeholder=True)
        
    update_snbt(snippet)

if __name__ == "__main__":
    main()