"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireDefault(require("react-native-reanimated"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const {
  event,
  divide,
  onChange,
  cond,
  eq,
  round,
  call,
  Value
} = _reactNativeReanimated.default;
class ScrollPager extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "initialOffset", {
      x: this.props.navigationState.index * this.props.layout.width,
      y: 0
    });
    _defineProperty(this, "wasTouched", false);
    _defineProperty(this, "interactionHandle", null);
    _defineProperty(this, "scrollViewRef", /*#__PURE__*/React.createRef());
    _defineProperty(this, "jumpTo", key => {
      this.wasTouched = false;
      const {
        navigationState,
        keyboardDismissMode,
        onIndexChange
      } = this.props;
      const index = navigationState.routes.findIndex(route => route.key === key);
      if (navigationState.index === index) {
        this.scrollTo(index * this.props.layout.width);
      } else {
        onIndexChange(index);
        if (keyboardDismissMode === 'auto') {
          _reactNative.Keyboard.dismiss();
        }
      }
    });
    _defineProperty(this, "scrollTo", (x, animated = true) => {
      if (this.scrollViewRef.current) {
        var _this$scrollViewRef$c, _this$scrollViewRef$c2;
        // getNode() is not necessary in newer versions of React Native
        const scrollView =
        // @ts-ignore
        typeof ((_this$scrollViewRef$c = this.scrollViewRef.current) === null || _this$scrollViewRef$c === void 0 ? void 0 : _this$scrollViewRef$c.scrollTo) === 'function' ? this.scrollViewRef.current : (_this$scrollViewRef$c2 = this.scrollViewRef.current) === null || _this$scrollViewRef$c2 === void 0 ? void 0 : _this$scrollViewRef$c2.getNode();

        // @ts-ignore
        scrollView === null || scrollView === void 0 ? void 0 : scrollView.scrollTo({
          x,
          animated: animated
        });
      }
    });
    _defineProperty(this, "enterListeners", []);
    _defineProperty(this, "addListener", (type, listener) => {
      switch (type) {
        case 'enter':
          this.enterListeners.push(listener);
          break;
      }
    });
    _defineProperty(this, "removeListener", (type, listener) => {
      switch (type) {
        case 'enter':
          {
            const index = this.enterListeners.indexOf(listener);
            if (index > -1) {
              this.enterListeners.splice(index, 1);
            }
            break;
          }
      }
    });
    _defineProperty(this, "position", new _reactNativeReanimated.default.Value(this.props.navigationState.index * this.props.layout.width));
    _defineProperty(this, "onScroll", event([{
      nativeEvent: {
        contentOffset: {
          x: this.position
        }
      }
    }]));
    _defineProperty(this, "layoutWidthNode", new Value(this.props.layout.width));
    _defineProperty(this, "relativePosition", divide(this.position, this.layoutWidthNode));
  }
  componentDidMount() {
    if (this.props.layout.width) {
      this.scrollTo(this.props.navigationState.index * this.props.layout.width, false);
    }
  }
  componentDidUpdate(prevProps) {
    const offset = this.props.navigationState.index * this.props.layout.width;
    if (prevProps.navigationState.routes.length !== this.props.navigationState.routes.length || prevProps.layout.width !== this.props.layout.width) {
      this.scrollTo(offset, false);
    } else if (prevProps.navigationState.index !== this.props.navigationState.index) {
      this.scrollTo(offset);
    }
    if (prevProps.layout.width !== this.props.layout.width) {
      this.layoutWidthNode.setValue(this.props.layout.width);
    }
  }
  componentWillUnmount() {
    if (this.interactionHandle !== null) {
      _reactNative.InteractionManager.clearInteractionHandle(this.interactionHandle);
    }
  }

  // InteractionHandle to handle tasks around animations

  render() {
    const {
      children,
      layout,
      onSwipeStart,
      onSwipeEnd,
      overscroll,
      onIndexChange,
      navigationState
    } = this.props;
    const handleSwipeStart = () => {
      this.wasTouched = false;
      onSwipeStart === null || onSwipeStart === void 0 ? void 0 : onSwipeStart();
      this.interactionHandle = _reactNative.InteractionManager.createInteractionHandle();
    };
    const handleSwipeEnd = () => {
      this.wasTouched = true;
      onSwipeEnd === null || onSwipeEnd === void 0 ? void 0 : onSwipeEnd();
      if (this.interactionHandle !== null) {
        _reactNative.InteractionManager.clearInteractionHandle(this.interactionHandle);
      }
    };
    return children({
      position: this.relativePosition,
      addListener: this.addListener,
      removeListener: this.removeListener,
      jumpTo: this.jumpTo,
      render: children => /*#__PURE__*/React.createElement(_reactNativeReanimated.default.ScrollView, {
        pagingEnabled: true,
        directionalLockEnabled: true,
        keyboardDismissMode: "on-drag",
        keyboardShouldPersistTaps: "always",
        overScrollMode: "never",
        scrollToOverflowEnabled: true,
        scrollEnabled: this.props.swipeEnabled,
        automaticallyAdjustContentInsets: false,
        bounces: overscroll,
        scrollsToTop: false,
        showsHorizontalScrollIndicator: false,
        scrollEventThrottle: 1,
        onScroll: this.onScroll,
        onScrollBeginDrag: handleSwipeStart,
        onScrollEndDrag: handleSwipeEnd,
        onMomentumScrollEnd: this.onScroll,
        contentOffset: this.initialOffset,
        style: styles.container,
        contentContainerStyle: layout.width ? {
          flexDirection: 'row',
          width: layout.width * navigationState.routes.length,
          flex: 1
        } : null,
        ref: this.scrollViewRef
      }, children, /*#__PURE__*/React.createElement(_reactNativeReanimated.default.Code, {
        exec: onChange(this.relativePosition, cond(eq(round(this.relativePosition), this.relativePosition), [call([this.relativePosition], ([relativePosition]) => {
          if (this.wasTouched) {
            onIndexChange(relativePosition);
            this.wasTouched = false;
          }
        })]))
      }))
    });
  }
}
exports.default = ScrollPager;
_defineProperty(ScrollPager, "defaultProps", {
  bounces: true
});
const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1
  }
});
//# sourceMappingURL=ScrollPager.js.map