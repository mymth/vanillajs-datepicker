const defaultShortcutKeys = {
  show: {key: 'ArrowDown'},
  hide: null,
  toggle: {key: 'Escape'},
  prevButton: {key: 'ArrowLeft', ctrlOrMetaKey: true},
  nextButton: {key: 'ArrowRight', ctrlOrMetaKey: true},
  viewSwitch: {key: 'ArrowUp', ctrlOrMetaKey: true},
  clearButton: {key: 'Backspace', ctrlOrMetaKey: true},
  todayButton: {key: '.', ctrlOrMetaKey: true},
  exitEditMode: {key: 'ArrowDown', ctrlOrMetaKey: true},
};

export default function createShortcutKeyConfig(options) {
  return Object.keys(defaultShortcutKeys).reduce((keyDefs, shortcut) => {
    const keyDef = options[shortcut] === undefined
      ? defaultShortcutKeys[shortcut]
      : options[shortcut];
    const key = keyDef && keyDef.key;
    if (!key || typeof key !== 'string') {
      return keyDefs;
    }

    const normalizedDef = {
      key,
      ctrlOrMetaKey: !!(keyDef.ctrlOrMetaKey || keyDef.ctrlKey || keyDef.metaKey),
    };
    if (key.length > 1) {
      normalizedDef.altKey = !!keyDef.altKey;
      normalizedDef.shiftKey = !!keyDef.shiftKey;
    }
    keyDefs[shortcut] = normalizedDef;
    return keyDefs;
  }, {});
}
