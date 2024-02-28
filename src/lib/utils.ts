export const centerRectOnScreen = (targetWidth: number, targetHeight: number) => {
  const left = (window.innerWidth - targetWidth) / 2 + window.screenLeft
  const top = (window.innerHeight - targetHeight) / 2 + window.screenTop
  return { width: targetWidth, height: targetHeight, left, top }
}
