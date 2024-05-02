function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { TouchableNativeFeedback, TouchableOpacity, Platform, View } from 'react-native';
const LOLLIPOP = 21;
export default class TouchableItem extends React.Component {
  render() {
    const {
      style,
      pressOpacity,
      pressColor,
      borderless,
      children,
      ...rest
    } = this.props;
    if (Platform.OS === 'android' && Platform.Version >= LOLLIPOP) {
      return /*#__PURE__*/React.createElement(TouchableNativeFeedback, _extends({}, rest, {
        background: TouchableNativeFeedback.Ripple(pressColor, borderless)
      }), /*#__PURE__*/React.createElement(View, {
        style: style
      }, React.Children.only(children)));
    } else {
      return /*#__PURE__*/React.createElement(TouchableOpacity, _extends({}, rest, {
        style: style,
        activeOpacity: pressOpacity
      }), children);
    }
  }
}
_defineProperty(TouchableItem, "defaultProps", {
  pressColor: 'rgba(255, 255, 255, .4)'
});
//# sourceMappingURL=TouchableItem.js.map