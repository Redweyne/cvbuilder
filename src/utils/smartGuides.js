const SNAP_THRESHOLD = 8;

export function calculateSnapGuides(
  movingElement,
  allElements,
  canvasWidth,
  canvasHeight,
  excludeId = null
) {
  const guides = {
    vertical: [],
    horizontal: [],
  };

  const snapPositions = {
    x: null,
    y: null,
  };

  const movingLeft = movingElement.x;
  const movingRight = movingElement.x + movingElement.width;
  const movingCenterX = movingElement.x + movingElement.width / 2;
  const movingTop = movingElement.y;
  const movingBottom = movingElement.y + movingElement.height;
  const movingCenterY = movingElement.y + movingElement.height / 2;

  const canvasCenterX = canvasWidth / 2;
  const canvasCenterY = canvasHeight / 2;

  const checkVerticalSnap = (position, sourceType = 'element') => {
    const leftDiff = Math.abs(movingLeft - position);
    const rightDiff = Math.abs(movingRight - position);
    const centerDiff = Math.abs(movingCenterX - position);

    if (leftDiff < SNAP_THRESHOLD) {
      if (snapPositions.x === null || leftDiff < Math.abs(movingLeft - snapPositions.x)) {
        snapPositions.x = position;
        snapPositions.xOffset = 0;
      }
      return { position, type: 'left', sourceType };
    }
    if (rightDiff < SNAP_THRESHOLD) {
      if (snapPositions.x === null || rightDiff < Math.abs(movingRight - (snapPositions.x + movingElement.width))) {
        snapPositions.x = position - movingElement.width;
        snapPositions.xOffset = movingElement.width;
      }
      return { position, type: 'right', sourceType };
    }
    if (centerDiff < SNAP_THRESHOLD) {
      if (snapPositions.x === null || centerDiff < Math.abs(movingCenterX - (snapPositions.x + movingElement.width / 2))) {
        snapPositions.x = position - movingElement.width / 2;
        snapPositions.xOffset = movingElement.width / 2;
      }
      return { position, type: 'center', sourceType };
    }
    return null;
  };

  const checkHorizontalSnap = (position, sourceType = 'element') => {
    const topDiff = Math.abs(movingTop - position);
    const bottomDiff = Math.abs(movingBottom - position);
    const centerDiff = Math.abs(movingCenterY - position);

    if (topDiff < SNAP_THRESHOLD) {
      if (snapPositions.y === null || topDiff < Math.abs(movingTop - snapPositions.y)) {
        snapPositions.y = position;
        snapPositions.yOffset = 0;
      }
      return { position, type: 'top', sourceType };
    }
    if (bottomDiff < SNAP_THRESHOLD) {
      if (snapPositions.y === null || bottomDiff < Math.abs(movingBottom - (snapPositions.y + movingElement.height))) {
        snapPositions.y = position - movingElement.height;
        snapPositions.yOffset = movingElement.height;
      }
      return { position, type: 'bottom', sourceType };
    }
    if (centerDiff < SNAP_THRESHOLD) {
      if (snapPositions.y === null || centerDiff < Math.abs(movingCenterY - (snapPositions.y + movingElement.height / 2))) {
        snapPositions.y = position - movingElement.height / 2;
        snapPositions.yOffset = movingElement.height / 2;
      }
      return { position, type: 'center', sourceType };
    }
    return null;
  };

  const leftEdge = checkVerticalSnap(0, 'canvas');
  if (leftEdge) guides.vertical.push(leftEdge);

  const rightEdge = checkVerticalSnap(canvasWidth, 'canvas');
  if (rightEdge) guides.vertical.push(rightEdge);

  const centerX = checkVerticalSnap(canvasCenterX, 'canvas-center');
  if (centerX) guides.vertical.push(centerX);

  const topEdge = checkHorizontalSnap(0, 'canvas');
  if (topEdge) guides.horizontal.push(topEdge);

  const bottomEdge = checkHorizontalSnap(canvasHeight, 'canvas');
  if (bottomEdge) guides.horizontal.push(bottomEdge);

  const centerY = checkHorizontalSnap(canvasCenterY, 'canvas-center');
  if (centerY) guides.horizontal.push(centerY);

  allElements.forEach((element) => {
    if (element.id === excludeId) return;

    const elLeft = element.x;
    const elRight = element.x + element.width;
    const elCenterX = element.x + element.width / 2;
    const elTop = element.y;
    const elBottom = element.y + element.height;
    const elCenterY = element.y + element.height / 2;

    [elLeft, elRight, elCenterX].forEach((pos) => {
      const guide = checkVerticalSnap(pos, 'element');
      if (guide) guides.vertical.push(guide);
    });

    [elTop, elBottom, elCenterY].forEach((pos) => {
      const guide = checkHorizontalSnap(pos, 'element');
      if (guide) guides.horizontal.push(guide);
    });
  });

  const uniqueVertical = [];
  const seenVertical = new Set();
  guides.vertical.forEach((g) => {
    if (!seenVertical.has(g.position)) {
      seenVertical.add(g.position);
      uniqueVertical.push(g);
    }
  });

  const uniqueHorizontal = [];
  const seenHorizontal = new Set();
  guides.horizontal.forEach((g) => {
    if (!seenHorizontal.has(g.position)) {
      seenHorizontal.add(g.position);
      uniqueHorizontal.push(g);
    }
  });

  return {
    guides: {
      vertical: uniqueVertical,
      horizontal: uniqueHorizontal,
    },
    snapPositions,
  };
}

export function getGuideColor(sourceType) {
  switch (sourceType) {
    case 'canvas-center':
      return '#ec4899';
    case 'canvas':
      return '#22c55e';
    case 'element':
    default:
      return '#6366f1';
  }
}

export { SNAP_THRESHOLD };
