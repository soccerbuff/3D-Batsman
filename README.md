# 3D Batsman Dashboard

Cover-drive side-view analysis with video + metrics at the top and report/coach view below.

## Setup

1. **Dashboard data** – `cover_drive_report.json` and `side_metrics.json` should be in `public/` (already there if you copied them).

2. **Video** – For the top “play the frames” section, put the annotated video in `public/`:
   ```bash
   copy side_annotated.mp4 public\
   ```
   (So the app can load it at `/side_annotated.mp4`.)

2. Install and run:
   ```bash
   npm install
   npm run dev
   ```

3. **Phase images (optional)**  
   The storyboard shows one card per phase. To display extracted images:
   - Create folder: `public/phases/`
   - Add images named by frame: `frame_0.jpg`, `frame_229.jpg`, `frame_230.jpg`, `frame_237.jpg`, `frame_253.jpg`, `frame_259.jpg`, `frame_260.jpg`  
   (You can use `.png` etc.; the app looks for `.jpg` by default—edit `getPhaseImageUrl` in `src/components/Storyboard.jsx` if you use another extension.)

## Data

The dashboard expects `cover_drive_side_dashboard.json` in `public/`. It uses:

- **meta** – shot type, view, frame rate, frame count  
- **shot_context** – definition, power intent, evaluation principles  
- **phase_ranges** & **key_frames** – P0, P2, P3, PostP3 and key frame numbers  
- **visuals.storyboard_frames** – phase labels and frame numbers for images  
- **report.summary** – what went right / what went wrong  
- **report.why** – evidence, explanations, citations  
- **visuals.timelines** – sequencing, weight transfer, bat speed  
- **training_prescription** – focus and drills  

Build: `npm run build` (output in `dist/`).
