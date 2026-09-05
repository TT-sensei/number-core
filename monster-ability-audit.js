// Compatibility layer: monster abilities are handled centrally in gameplay-fix.js.
(() => {
  if (typeof applyPlayerCommand === 'function') window.applyPlayerCommand = applyPlayerCommand;
})();
