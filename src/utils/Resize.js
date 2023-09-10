const canvasToDisplaySizeMap = new Map([]);

function onResize(entries) {
  for (const entry of entries) {
    let width;
    let height;
    let dpr = window.devicePixelRatio;
    if (entry.devicePixelContentBoxSize) {
      // NOTE: Only this path gives the correct answer
      // The other 2 paths are an imperfect fallback
      // for browsers that don't provide anyway to do this
      width = entry.devicePixelContentBoxSize[0].inlineSize;
      height = entry.devicePixelContentBoxSize[0].blockSize;
      dpr = 1; // it's already in width and height
    } else if (entry.contentBoxSize) {
      if (entry.contentBoxSize[0]) {
        width = entry.contentBoxSize[0].inlineSize;
        height = entry.contentBoxSize[0].blockSize;
      } else {
        // legacy
        width = entry.contentBoxSize.inlineSize;
        height = entry.contentBoxSize.blockSize;
      }
    } else {
      // legacy
      width = entry.contentRect.width;
      height = entry.contentRect.height;
    }
    const displayWidth = Math.round(width * dpr);
    const displayHeight = Math.round(height * dpr);
    canvasToDisplaySizeMap.set(entry.target, [displayWidth, displayHeight]);
  }
}

export const resizeEvent = (canvas) => {
  canvasToDisplaySizeMap.set(canvas, [600, 480]);

  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(canvas, { box: 'content-box' });
};

export const resizeCanvasToDisplaySize = (canvas) => {
  // Lookup the size the browser is displaying the canvas in CSS pixels.

  //"window.devicePixelRatio" in JavaScript represents the ratio of the resolution in
  //physical pixels to the resolution in CSS pixels for the current device or screen

  //   const dpr = window.devicePixelRatio;
  //   const displayWidth = Math.round(canvas.clientWidth * dpr);
  //   const displayHeight = Math.round(canvas.clientHeight * dpr);

  // Get the size the browser is displaying the canvas in device pixels.
  const [displayWidth, displayHeight] = canvasToDisplaySizeMap.get(canvas);

  // Check if the canvas is not the same size.
  const needResize =
    canvas.width !== displayWidth || canvas.height !== displayHeight;

  if (needResize) {
    // Make the canvas the same size
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }

  return needResize;
};
