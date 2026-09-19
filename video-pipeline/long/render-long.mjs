// Long-form 16:9 slideshow videos (YouTube "normal" videos, not Shorts):
// slow zoom on each image, crossfades, a title at the start of each section,
// optional background music. Agnostic to where the images come from (Google
// Flow exports, Gemini/Imagen API, photos...): it just takes image paths.
import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { ROOT_DIR, SITE_BRAND_CAPTION } from "../config.mjs";

const exec = promisify(execFile);
const W = 1920;
const H = 1080;
const FPS = 30;
const XFADE = 1.2; // crossfade length, seconds
const MAX_XFADE_INPUTS = 25; // keep each ffmpeg filtergraph a manageable size

const MUSIC_DIR = path.join(ROOT_DIR, "video-pipeline", "assets", "music");

// ffmpeg's filter parser chokes on Windows drive letters ("C:"), so every
// path embedded in a filter is made relative to ROOT_DIR and ffmpeg runs
// with cwd=ROOT_DIR (same trick as render.mjs).
const rel = (p) => path.relative(ROOT_DIR, p).split(path.sep).join("/");

function findFont() {
  const candidates = [
    process.env.FONT_PATH,
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "C:\\Windows\\Fonts\\segoeuib.ttf",
    "C:\\Windows\\Fonts\\arialbd.ttf",
  ];
  return candidates.find((c) => c && fs.existsSync(c)) || null;
}

async function ffmpeg(args) {
  await exec("ffmpeg", ["-y", "-loglevel", "error", ...args], { cwd: ROOT_DIR, maxBuffer: 1 << 26 });
}

async function renderClip({ image, duration, label, zoomIn, outPath, tmpDir, index, font }) {
  const frames = Math.round(duration * FPS);
  // Any aspect ratio in: blurred cover background + contained foreground, so
  // portrait or square images never get cropped awkwardly.
  const compose =
    `[0:v]split[a][b];` +
    `[a]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},boxblur=30:5[bg];` +
    `[b]scale=${W}:${H}:force_original_aspect_ratio=decrease[fg];` +
    `[bg][fg]overlay=(W-w)/2:(H-h)/2,scale=${W * 2}:${H * 2},setsar=1[big];`;
  const z = zoomIn ? `1+0.08*on/${frames}` : `1.08-0.08*on/${frames}`;
  let chain =
    compose +
    `[big]zoompan=z='${z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=${W}x${H}:fps=${FPS},` +
    `eq=saturation=1.05:contrast=1.03`;

  const fontOpt = font ? `fontfile=${rel(font)}` : "font=Sans";
  const brandFile = path.join(tmpDir, "brand.txt");
  fs.writeFileSync(brandFile, SITE_BRAND_CAPTION);
  chain += `,drawtext=${fontOpt}:textfile=${rel(brandFile)}:fontsize=26:fontcolor=white@0.7:x=w-tw-40:y=h-th-34:shadowcolor=black@0.5:shadowx=2:shadowy=2`;

  if (label) {
    const labelFile = path.join(tmpDir, `label-${index}.txt`);
    fs.writeFileSync(labelFile, label);
    const alpha = `if(lt(t,0.8),t/0.8,if(lt(t,4.2),1,if(lt(t,5),(5-t)/0.8,0)))`;
    chain += `,drawtext=${fontOpt}:textfile=${rel(labelFile)}:fontsize=58:fontcolor=white:alpha='${alpha}':x=80:y=h-220:box=1:boxcolor=black@0.45:boxborderw=24`;
  }
  chain += `,format=yuv420p[v]`;

  await ffmpeg([
    "-i", rel(image),
    "-filter_complex", chain,
    "-map", "[v]",
    "-t", String(duration),
    "-r", String(FPS),
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
    rel(outPath),
  ]);
}

// Chains clips with crossfades. Returns the merged file's duration.
async function xfadeMerge(clips, outPath) {
  if (clips.length === 1) {
    fs.copyFileSync(clips[0].file, outPath);
    return clips[0].duration;
  }
  const inputs = clips.flatMap((c) => ["-i", rel(c.file)]);
  let graph = "";
  let prev = "[0:v]";
  let offset = 0;
  for (let i = 1; i < clips.length; i++) {
    offset += clips[i - 1].duration - XFADE;
    const out = i === clips.length - 1 ? "[v]" : `[x${i}]`;
    graph += `${prev}[${i}:v]xfade=transition=fade:duration=${XFADE}:offset=${offset.toFixed(3)}${out};`;
    prev = out;
  }
  await ffmpeg([...inputs, "-filter_complex", graph.slice(0, -1), "-map", "[v]", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-r", String(FPS), rel(outPath)]);
  return clips.reduce((s, c) => s + c.duration, 0) - XFADE * (clips.length - 1);
}

async function mergeAll(clips, tmpDir, depth = 0) {
  if (clips.length <= MAX_XFADE_INPUTS) {
    const out = path.join(tmpDir, `merge-${depth}-final.mp4`);
    return { file: out, duration: await xfadeMerge(clips, out) };
  }
  const groups = [];
  for (let i = 0; i < clips.length; i += MAX_XFADE_INPUTS) groups.push(clips.slice(i, i + MAX_XFADE_INPUTS));
  const merged = [];
  for (const [g, group] of groups.entries()) {
    const out = path.join(tmpDir, `merge-${depth}-${g}.mp4`);
    merged.push({ file: out, duration: await xfadeMerge(group, out) });
  }
  return mergeAll(merged, tmpDir, depth + 1);
}

function musicTracks() {
  if (!fs.existsSync(MUSIC_DIR)) return [];
  return fs
    .readdirSync(MUSIC_DIR)
    .filter((f) => /\.(mp3|m4a|wav|ogg)$/i.test(f))
    .sort()
    .map((f) => path.join(MUSIC_DIR, f));
}

async function addAudio(videoFile, duration, outPath, tmpDir) {
  const tracks = musicTracks();
  if (!tracks.length) {
    await ffmpeg(["-i", rel(videoFile), "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo", "-shortest", "-c:v", "copy", "-c:a", "aac", rel(outPath)]);
    return false;
  }
  const list = path.join(tmpDir, "music.txt");
  fs.writeFileSync(list, tracks.map((t) => `file '${t.replace(/\\/g, "/").replace(/'/g, "'\\''")}'`).join("\n"));
  const fadeOut = Math.max(0, duration - 5).toFixed(2);
  await ffmpeg([
    "-i", rel(videoFile),
    "-stream_loop", "-1", "-f", "concat", "-safe", "0", "-i", rel(list),
    "-filter_complex", `[1:a]volume=0.8,afade=t=in:d=3,afade=t=out:st=${fadeOut}:d=5[a]`,
    "-map", "0:v", "-map", "[a]",
    "-t", duration.toFixed(2),
    "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
    rel(outPath),
  ]);
  return true;
}

// theme: { sections: [{ title, images: [absPath...] }], imageSeconds? }
export async function renderLongVideo({ theme, outPath, tmpDir }) {
  fs.mkdirSync(tmpDir, { recursive: true });
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const font = findFont();
  const seconds = theme.imageSeconds || 7;

  const clips = [];
  const chapters = [];
  let timeline = 0;
  let index = 0;
  for (const section of theme.sections) {
    section.images.forEach((image, i) => {
      if (i === 0) chapters.push({ time: timeline, title: section.title });
      clips.push({ image, duration: seconds, label: i === 0 ? section.title : null, index });
      timeline += seconds - XFADE;
      index++;
    });
  }

  for (const clip of clips) {
    clip.file = path.join(tmpDir, `clip-${String(clip.index).padStart(4, "0")}.mp4`);
    await renderClip({ ...clip, zoomIn: clip.index % 2 === 0, outPath: clip.file, tmpDir, font });
    process.stdout.write(`\rClips rendus : ${clip.index + 1}/${clips.length}`);
  }
  process.stdout.write("\n");

  const merged = await mergeAll(clips, tmpDir);
  const withMusic = await addAudio(merged.file, merged.duration, outPath, tmpDir);
  return { duration: merged.duration, chapters, withMusic };
}

export function formatTimestamp(seconds) {
  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}
