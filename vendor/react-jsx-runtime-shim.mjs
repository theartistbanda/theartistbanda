const React = window.React;

export function jsx(type, config, key) {
  return React.createElement(type, key === undefined ? config : { ...config, key });
}
export function jsxs(type, config, key) {
  return React.createElement(type, key === undefined ? config : { ...config, key });
}
export const Fragment = React.Fragment;
