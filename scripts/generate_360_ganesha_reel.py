import math
import os
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import imageio
import imageio_ffmpeg
import wave

# Output video settings (1080x1920 is standard 9:16 vertical Reel format)
WIDTH = 1080
HEIGHT = 1920
FPS = 30
DURATION_SEC = 10
TOTAL_FRAMES = FPS * DURATION_SEC

base_dir = r"d:\DevSpace\3dprintingbusiness"
img_paths = [
    os.path.join(base_dir, "public", "images", "ganesha_front.jpg"),
    os.path.join(base_dir, "public", "images", "ganesha_right.jpg"),
    os.path.join(base_dir, "public", "images", "ganesha_back.jpg"),
    os.path.join(base_dir, "public", "images", "ganesha_left.jpg"),
    os.path.join(base_dir, "public", "images", "ganesha_lifestyle_mandir.png"),
    os.path.join(base_dir, "public", "images", "ganesha_front.jpg")
]

loaded_images = []
for p in img_paths:
    if os.path.exists(p):
        img = Image.open(p).convert("RGB")
        loaded_images.append(img)

print(f"Loaded {len(loaded_images)} keyframe images.")

def create_background_gradient(w, h, t):
    top_color = np.array([16, 16, 20], dtype=np.float32)
    bottom_color = np.array([36, 26, 18], dtype=np.float32)
    
    y = np.linspace(0, 1, h, dtype=np.float32)[:, None, None]
    grad = top_color * (1.0 - y) + bottom_color * y
    grad = np.repeat(grad, w, axis=1)
    
    pulse = 0.85 + 0.15 * math.sin(t * math.pi * 2)
    cx, cy = w // 2, int(h * 0.46)
    
    Y, X = np.ogrid[:h, :w]
    dist_from_center = np.sqrt((X - cx)**2 + (Y - cy)**2)
    radius = 550.0
    glow = np.clip(1.0 - dist_from_center / radius, 0.0, 1.0) ** 2 * 65.0 * pulse
    
    glow_color = np.array([255, 175, 80], dtype=np.float32)
    bg = grad + glow[:, :, None] * (glow_color / 255.0)
    bg = np.clip(bg, 0, 255).astype(np.uint8)
    
    return Image.fromarray(bg)

def create_frame(frame_idx):
    t = frame_idx / TOTAL_FRAMES
    bg = create_background_gradient(WIDTH, HEIGHT, t)
    
    num_transitions = len(loaded_images) - 1
    prog = t * num_transitions
    curr_idx = min(int(prog), num_transitions - 1)
    next_idx = curr_idx + 1
    sub_t = prog - curr_idx
    
    ease_t = 0.5 - 0.5 * math.cos(sub_t * math.pi)
    
    img1 = loaded_images[curr_idx]
    img2 = loaded_images[next_idx]
    
    target_box = (820, 820)
    
    def process_product_img(img, zoom_scale=1.0):
        w, h = img.size
        scale = min(target_box[0] / w, target_box[1] / h) * zoom_scale
        nw, nh = int(w * scale), int(h * scale)
        return img.resize((nw, nh), Image.Resampling.LANCZOS)
    
    breathe = 1.0 + 0.03 * math.sin(t * math.pi * 4)
    res1 = process_product_img(img1, breathe)
    res2 = process_product_img(img2, breathe)
    
    pos_y = int(HEIGHT * 0.45)
    
    scale_x1 = max(0.01, math.cos(ease_t * math.pi * 0.5))
    scale_x2 = max(0.01, math.sin(ease_t * math.pi * 0.5))
    
    w1, h1 = res1.size
    w1_s = max(2, int(w1 * scale_x1))
    r1_s = res1.resize((w1_s, h1), Image.Resampling.BILINEAR)
    
    w2, h2 = res2.size
    w2_s = max(2, int(w2 * scale_x2))
    r2_s = res2.resize((w2_s, h2), Image.Resampling.BILINEAR)
    
    draw_bg = ImageDraw.Draw(bg)
    
    shadow_w = int(580 * breathe)
    shadow_h = 45
    draw_bg.ellipse(
        [WIDTH//2 - shadow_w//2, pos_y + 420 - shadow_h//2, WIDTH//2 + shadow_w//2, pos_y + 420 + shadow_h//2],
        fill=(10, 8, 8)
    )
    
    if ease_t < 0.5:
        bg.paste(r1_s, (WIDTH//2 - w1_s//2, pos_y - h1//2))
    else:
        bg.paste(r2_s, (WIDTH//2 - w2_s//2, pos_y - h2//2))
        
    draw = ImageDraw.Draw(bg)
    
    # Header Typography
    draw.text((WIDTH // 2, 220), "VIYONA DESIGNS", fill=(255, 215, 130), anchor="mm")
    draw.text((WIDTH // 2, 290), "360° PRECISION CRAFT", fill=(240, 240, 245), anchor="mm")
    draw.text((WIDTH // 2, 350), "Modern Scandinavian Minimalist Idol", fill=(180, 180, 190), anchor="mm")
    
    # Feature Badges
    card_y = 1380
    draw.text((WIDTH // 2, card_y), "Plant-Based Bio-Plastic • Eco Friendly", fill=(255, 255, 255), anchor="mm")
    draw.text((WIDTH // 2, card_y + 70), "Featherweight (45g) • Car Dashboard & Mandir", fill=(220, 220, 230), anchor="mm")
    draw.text((WIDTH // 2, card_y + 140), "Special 54% OFF Launch Offer (INR 550)", fill=(255, 205, 110), anchor="mm")
    
    # CTA Button
    btn_w, btn_h = 680, 95
    btn_x0 = WIDTH // 2 - btn_w // 2
    btn_y0 = 1640
    draw.rounded_rectangle([btn_x0, btn_y0, btn_x0 + btn_w, btn_y0 + btn_h], radius=48, fill=(245, 185, 80))
    draw.text((WIDTH // 2, btn_y0 + btn_h // 2), "TAP PROFILE TO ORDER ON AMAZON", fill=(20, 15, 10), anchor="mm")
    
    return np.array(bg)

def generate_sacred_audio(duration_sec, sample_rate=44100):
    num_samples = int(duration_sec * sample_rate)
    t = np.linspace(0, duration_sec, num_samples, endpoint=False)
    
    om_freq = 136.1
    drone1 = np.sin(2 * np.pi * om_freq * t) * 0.35
    drone2 = np.sin(2 * np.pi * (om_freq * 2) * t) * 0.15
    drone3 = np.sin(2 * np.pi * (om_freq * 3) * t) * 0.08
    drone4 = np.sin(2 * np.pi * (om_freq * 0.5) * t) * 0.25
    drone = drone1 + drone2 + drone3 + drone4
    
    chimes = np.zeros_like(t)
    bell_freqs = [528.0, 639.0, 741.0, 852.0]
    
    for strike_time in [0.2, 3.5, 7.0]:
        idx_start = int(strike_time * sample_rate)
        decay_time = t[idx_start:] - strike_time
        for bf in bell_freqs:
            decay_env = np.exp(-decay_time * 0.85)
            bell_tone = np.sin(2 * np.pi * bf * decay_time) * decay_env * 0.15
            chimes[idx_start:] += bell_tone
            
    full_audio = drone * 0.6 + chimes * 0.4
    
    fade_len = int(sample_rate * 0.6)
    fade_in = np.linspace(0, 1, fade_len)
    fade_out = np.linspace(1, 0, fade_len)
    full_audio[:fade_len] *= fade_in
    full_audio[-fade_len:] *= fade_out
    
    full_audio = full_audio / np.max(np.abs(full_audio)) * 0.85
    audio_int16 = (full_audio * 32767).astype(np.int16)
    return audio_int16, sample_rate

print("Rendering 10-second 360 reel (300 frames)...")
output_video_path = os.path.join(base_dir, "public", "ganesha_360_reel.mp4")
output_audio_path = os.path.join(base_dir, "public", "sacred_audio.wav")
temp_video_path = os.path.join(base_dir, "public", "temp_video.mp4")

# Generate audio wav
audio_data, sr = generate_sacred_audio(DURATION_SEC)
with wave.open(output_audio_path, "wb") as wav_file:
    wav_file.setnchannels(1)
    wav_file.setsampwidth(2)
    wav_file.setframerate(sr)
    wav_file.writeframes(audio_data.tobytes())
print(f"Saved sacred devotional audio to {output_audio_path}")

# Render video frames
writer = imageio.get_writer(temp_video_path, fps=FPS, codec="libx264", quality=8, pixelformat="yuv420p")
for f in range(TOTAL_FRAMES):
    if f % 50 == 0:
        print(f"  Frame {f}/{TOTAL_FRAMES}...")
    frame_np = create_frame(f)
    writer.append_data(frame_np)
writer.close()
print("Video stream rendered.")

# Mux using subprocess
ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
cmd = [
    ffmpeg_exe, "-y",
    "-i", temp_video_path,
    "-i", output_audio_path,
    "-c:v", "copy",
    "-c:a", "aac",
    "-b:a", "192k",
    "-shortest",
    output_video_path
]
res = subprocess.run(cmd, capture_output=True, text=True)
if res.returncode == 0:
    print(f"SUCCESS: 10-Second 360 Reel with Sacred Audio Ready: {output_video_path}")
else:
    print(f"Error muxing: {res.stderr}")

if os.path.exists(temp_video_path):
    os.remove(temp_video_path)
