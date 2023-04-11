"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
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
        background: _reactNative.TouchableNativeFeedback.Ripple(pressColor, !!borderless)
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