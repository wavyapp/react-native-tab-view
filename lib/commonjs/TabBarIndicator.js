"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _memoize = _interopRequireDefault(require("./memoize"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const {
  multiply,
  Extrapolate
} = _reactNativeReanimated.default;

// @ts-ignore
const interpolate = _reactNativeReanimated.default.interpolateNode || _reactNativeReanimated.default.interpolate;
class TabBarIndicator extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "fadeInIndicator", () => {
      const {
        navigationState,
        layout,
        width,
        getTabWidth
      } = this.props;
      if (!this.isIndicatorShown && width === 'auto' && layout.width &&
      // We should fade-in the indicator when we have widths for all the tab items
      navigationState.routes.every((_, i) => getTabWidth(i))) {
        this.isIndicatorShown = true;
        _reactNativeReanimated.default.timing(this.opacity, {
          duration: 150,
          toValue: 1,
          easing: _reactNativeReanimated.Easing.in(_reactNativeReanimated.Easing.linear)
        }).start();
      }
    });
    _defineProperty(this, "isIndicatorShown", false);
    _defineProperty(this, "opacity", new _reactNativeReanimated.default.Value(this.props.width === 'auto' ? 0 : 1));
    _defineProperty(this, "getTranslateX", (0, _memoize.default)((position, routes, getTabWidth) => {
      const inputRange = routes.map((_, i) => i);

      // every index contains widths at all previous indices
      const outputRange = routes.reduce((acc, _, i) => {
        if (i === 0) return [0];
        return [...acc, acc[i - 1] + getTabWidth(i - 1)];
      }, []);
      const translateX = interpolate(position, {
        inputRange,
        outputRange,
        extrapolate: Extrapolate.CLAMP
      });
      return multiply(translateX, _reactNative.I18nManager.isRTL ? -1 : 1);
    }));
    _defineProperty(this, "getWidth", (0, _memoize.default)((position, routes, getTabWidth) => {
      const inputRange = routes.map((_, i) => i);
      const outputRange = inputRange.map(getTabWidth);
      return interpolate(position, {
        inputRange,
        outputRange,
        extrapolate: Extrapolate.CLAMP
      });
    }));
  }
  componentDidMount() {
    this.fadeInIndicator();
  }
  componentDidUpdate() {
    this.fadeInIndicator();
  }
  render() {
    const {
      position,
      navigationState,
      getTabWidth,
      width,
      style,
      layout
    } = this.props;
    const {
      routes
    } = navigationState;
    const translateX = routes.length > 1 ? this.getTranslateX(position, routes, getTabWidth) : 0;
    const indicatorWidth = width === 'auto' ? routes.length > 1 ? this.getWidth(position, routes, getTabWidth) : getTabWidth(0) : width;
    return /*#__PURE__*/React.createElement(_reactNativeReanimated.default.View, {
      style: [styles.indicator,
      // If layout is not available, use `left` property for positioning the indicator
      // This avoids rendering delay until we are able to calculate translateX
      {
        width: indicatorWidth
      }, layout.width ? {
        transform: [{
          translateX
        }]
      } : {
        left: `${100 / routes.length * navigationState.index}%`
      }, width === 'auto' ? {
        opacity: this.opacity
      } : null, style]
    });
  }
}
exports.default = TabBarIndicator;
const styles = _reactNative.StyleSheet.create({
  indicator: {
    backgroundColor: '#ffeb3b',
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: 2
  }
});
//# sourceMappingURL=TabBarIndicator.js.map