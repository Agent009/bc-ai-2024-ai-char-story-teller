/**
 * Fix TS2307 module import errors for SVG files.
 */
declare module "*.svg" {
  const content: never;
  export default content;
}
