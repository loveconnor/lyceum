// HonestUI 0.4.1 assigns each icon's display name at module scope. Remove
// those assignments and mark the component factories as safe to tree-shake.
module.exports = function honestUiIconsLoader(source) {
  return source
    .replace(/^var (\w+) = React\.forwardRef\(/gm, "var $1 = /* @__PURE__ */ React.forwardRef(")
    .replace(/^\w+\.displayName = "[^"]*";\n/gm, "");
};
