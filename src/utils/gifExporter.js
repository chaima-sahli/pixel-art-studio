import GIF from 'gif.js';

export async function exportGIF(frames, gridSize, frameDelay = 200) {
  return new Promise((resolve, reject) => {
    try {
      const exportSize = Math.max(16, Math.floor(512 / gridSize));
      const width = gridSize * exportSize;
      const height = gridSize * exportSize;

      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: width,
        height: height,
        workerScript: '/gif.worker.js', 
      });

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const ctx = tempCanvas.getContext('2d');

      frames.forEach((frame) => {
        ctx.clearRect(0, 0, width, height);

        for (let row = 0; row < gridSize; row++) {
          for (let col = 0; col < gridSize; col++) {
            const color = frame[row]?.[col] || '#ffffff';
            ctx.fillStyle = color;
            ctx.fillRect(col * exportSize, row * exportSize, exportSize, exportSize);
          }
        }

        gif.addFrame(tempCanvas, {
          copy: true,
          delay: frameDelay,
        });
      });

      gif.on('progress', (p) => {
        console.log(`GIF progress: ${Math.round(p * 100)}%`);
      });

      gif.on('finished', (blob) => {
        resolve(blob);
      });

      gif.on('error', (error) => {
        reject(error);
      });

      gif.render();
    } catch (error) {
      reject(error);
    }
  });
}