"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const LOLLIPOP = 21;
class TouchableItem extends React.Component {
  render() {
    const {
      style,
      pressOpacity,
      pressColor,
      borderless,
      children,
      ...rest
    } = this.props;
    if (_reactNative.Platform.OS === 'android' && _reactNative.Platform.Version >= LOLLIPOP) {
      return /*#__PURE__*/React.createElement(_reactNative.TouchableNativeFeedback, _extends({}, rest, {
        background: _reactNative.TouchableNativeFeedback.Ripple(pressColor, borderless)
      }), /*#__PURE__*/React.createElement(_reactNative.View, {
        style: style
      }, React.Children.only(children)));
    } else {
      return /*#__PURE__*/React.createElement(_reactNative.TouchableOpacity, _extends({}, rest, {
        style: style,
        activeOpacity: pressOpacity
      }), children);
    }
  }
}
exports.default = TouchableItem;
_defineProperty(TouchableItem, "defaultProps", {
  pressColor: 'rgba(255, 255, 255, .4)'
});
//# sourceMappingURL=TouchableItem.js.map