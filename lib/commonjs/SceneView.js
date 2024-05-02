"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class SceneView extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      loading: Math.abs(this.props.navigationState.index - this.props.index) > this.props.lazyPreloadDistance
    });
    _defineProperty(this, "handleEnter", value => {
      const {
        index
      } = this.props;

      // If we're entering the current route, we need to load it
      if (value === index && this.state.loading) {
        this.setState({
          loading: false
        });
      }
    });
  }
  static getDerivedStateFromProps(props, state) {
    if (state.loading && Math.abs(props.navigationState.index - props.index) <= props.lazyPreloadDistance) {
      // Always render the route when it becomes focused
      return {
        loading: false
      };
    }
    return null;
  }
  componentDidMount() {
    if (this.props.lazy) {
      // If lazy mode is enabled, listen to when we enter screens
      this.props.addListener('enter', this.handleEnter);
    } else if (this.state.loading) {
      // If lazy mode is not enabled, render the scene with a delay if not loaded already
      // This improves the initial startup time as the scene is no longer blocking
      setTimeout(() => this.setState({
        loading: false
      }), 0);
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.lazy !== prevProps.lazy || this.state.loading !== prevState.loading) {
      // We only need the listener if the tab hasn't loaded yet and lazy is enabled
      if (this.props.lazy && this.state.loading) {
        this.props.addListener('enter', this.handleEnter);
      } else {
        this.props.removeListener('enter', this.handleEnter);
      }
    }
  }
  componentWillUnmount() {
    this.props.removeListener('enter', this.handleEnter);
  }
  render() {
    const {
      navigationState,
      index,
      layout,
      style
    } = this.props;
    const {
      loading
    } = this.state;
    const focused = navigationState.index === index;
    return /*#__PURE__*/React.createElement(_reactNative.View, {
      accessibilityElementsHidden: !focused,
      importantForAccessibility: focused ? 'auto' : 'no-hide-descendants',
      style: [styles.route,
      // If we don't have the layout yet, make the focused screen fill the container
      // This avoids delay before we are able to render pages side by side
      layout.width ? {
        width: layout.width
      } : focused ? _reactNative.StyleSheet.absoluteFill : null, style]
    },
    // Only render the route only if it's either focused or layout is available
    // When layout is not available, we must not render unfocused routes
    // so that the focused route can fill the screen
    focused || layout.width ? this.props.children({
      loading
    }) : null);
  }
}
exports.default = SceneView;
const styles = _reactNative.StyleSheet.create({
  route: {
    flex: 1,
    overflow: 'hidden'
  }
});
//# sourceMappingURL=SceneView.js.map