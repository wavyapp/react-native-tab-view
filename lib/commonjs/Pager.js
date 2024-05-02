"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _memoize = _interopRequireDefault(require("./memoize"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const {
  Clock,
  Value,
  onChange,
  and,
  or,
  abs,
  add,
  block,
  call,
  ceil,
  clockRunning,
  cond,
  divide,
  eq,
  event,
  floor,
  greaterThan,
  lessThan,
  max,
  min,
  multiply,
  neq,
  not,
  round,
  set,
  spring,
  startClock,
  stopClock,
  sub,
  timing
} = _reactNativeReanimated.default;
const PagerContext = /*#__PURE__*/React.createContext({});
const TRUE = 1;
const FALSE = 0;
const NOOP = 0;
const UNSET = -1;
const DIRECTION_LEFT = 1;
const DIRECTION_RIGHT = -1;
const SWIPE_DISTANCE_MINIMUM = 20;
const SWIPE_VELOCITY_IMPACT = 0.2;
const SPRING_CONFIG = {
  stiffness: 1000,
  damping: 500,
  mass: 3,
  overshootClamping: true,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01
};
const SPRING_VELOCITY_SCALE = 1;
const TIMING_CONFIG = {
  duration: 200,
  easing: _reactNativeReanimated.Easing.out(_reactNativeReanimated.Easing.cubic)
};
class Pager extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      enabled: true,
      childPanGestureHandlerRefs: []
    });
    _defineProperty(this, "mounted", false);
    _defineProperty(this, "providerVal", {
      addGestureHandlerRef: ref => {
        if (!this.state.childPanGestureHandlerRefs.includes(ref) && this.mounted) {
          this.setState(prevState => ({
            childPanGestureHandlerRefs: [...prevState.childPanGestureHandlerRefs, ref]
          }));
        }
      }
    });
    _defineProperty(this, "gestureHandlerRef", /*#__PURE__*/React.createRef());
    _defineProperty(this, "clock", new Clock());
    _defineProperty(this, "velocityX", new Value(0));
    _defineProperty(this, "gestureX", new Value(0));
    _defineProperty(this, "gestureState", new Value(_reactNativeGestureHandler.State.UNDETERMINED));
    _defineProperty(this, "offsetX", new Value(0));
    _defineProperty(this, "gesturesEnabled", new Value(1));
    _defineProperty(this, "progress", new Value(
    // Initial value is based on the index and page width
    this.props.navigationState.index * this.props.layout.width * DIRECTION_RIGHT));
    _defineProperty(this, "index", new Value(this.props.navigationState.index));
    _defineProperty(this, "nextIndex", new Value(UNSET));
    _defineProperty(this, "lastEnteredIndex", new Value(this.props.navigationState.index));
    _defineProperty(this, "isSwiping", new Value(FALSE));
    _defineProperty(this, "isSwipeGesture", new Value(FALSE));
    _defineProperty(this, "indexAtSwipeEnd", new Value(this.props.navigationState.index));
    _defineProperty(this, "routesLength", new Value(this.props.navigationState.routes.length));
    _defineProperty(this, "layoutWidth", new Value(this.props.layout.width));
    _defineProperty(this, "swipeVelocityImpact", new Value(this.props.swipeVelocityImpact !== undefined ? this.props.swipeVelocityImpact : SWIPE_VELOCITY_IMPACT));
    _defineProperty(this, "springVelocityScale", new Value(this.props.springVelocityScale !== undefined ? this.props.springVelocityScale : SPRING_VELOCITY_SCALE));
    _defineProperty(this, "position", cond(this.layoutWidth, divide(multiply(this.progress, -1), this.layoutWidth), this.index));
    _defineProperty(this, "springConfig", {
      damping: new Value(this.props.springConfig.damping !== undefined ? this.props.springConfig.damping : SPRING_CONFIG.damping),
      mass: new Value(this.props.springConfig.mass !== undefined ? this.props.springConfig.mass : SPRING_CONFIG.mass),
      stiffness: new Value(this.props.springConfig.stiffness !== undefined ? this.props.springConfig.stiffness : SPRING_CONFIG.stiffness),
      restSpeedThreshold: new Value(this.props.springConfig.restSpeedThreshold !== undefined ? this.props.springConfig.restSpeedThreshold : SPRING_CONFIG.restSpeedThreshold),
      restDisplacementThreshold: new Value(this.props.springConfig.restDisplacementThreshold !== undefined ? this.props.springConfig.restDisplacementThreshold : SPRING_CONFIG.restDisplacementThreshold)
    });
    _defineProperty(this, "timingConfig", {
      duration: new Value(this.props.timingConfig.duration !== undefined ? this.props.timingConfig.duration : TIMING_CONFIG.duration)
    });
    _defineProperty(this, "initialVelocityForSpring", new Value(0));
    _defineProperty(this, "currentIndexValue", this.props.navigationState.index);
    _defineProperty(this, "pendingIndexValue", undefined);
    _defineProperty(this, "previouslyFocusedTextInput", null);
    _defineProperty(this, "enterListeners", []);
    _defineProperty(this, "interactionHandle", null);
    _defineProperty(this, "jumpToIndex", index => {
      // If the index changed, we need to trigger a tab switch
      this.isSwipeGesture.setValue(FALSE);
      this.nextIndex.setValue(index);
    });
    _defineProperty(this, "jumpTo", key => {
      const {
        navigationState,
        keyboardDismissMode,
        onIndexChange
      } = this.props;
      const index = navigationState.routes.findIndex(route => route.key === key);

      // A tab switch might occur when we're in the middle of a transition
      // In that case, the index might be same as before
      // So we conditionally make the pager to update the position
      if (navigationState.index === index) {
        this.jumpToIndex(index);
      } else {
        onIndexChange(index);

        // When the index changes, the focused input will no longer be in current tab
        // So we should dismiss the keyboard
        if (keyboardDismissMode === 'auto') {
          _reactNative.Keyboard.dismiss();
        }
      }
    });
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
    _defineProperty(this, "handleEnteredIndexChange", ([value]) => {
      const index = Math.max(0, Math.min(value, this.props.navigationState.routes.length - 1));
      this.enterListeners.forEach(listener => listener(index));
    });
    _defineProperty(this, "transitionTo", index => {
      const toValue = new Value(0);
      const frameTime = new Value(0);
      const state = {
        position: this.progress,
        time: new Value(0),
        finished: new Value(FALSE)
      };
      return block([cond(clockRunning(this.clock), NOOP, [
      // Animation wasn't running before
      // Set the initial values and start the clock
      set(toValue, multiply(index, this.layoutWidth, DIRECTION_RIGHT)), set(frameTime, 0), set(state.time, 0), set(state.finished, FALSE), set(this.index, index)]), cond(this.isSwipeGesture,
      // Animate the values with a spring for swipe
      [cond(not(clockRunning(this.clock)), _reactNative.I18nManager.isRTL ? set(this.initialVelocityForSpring, multiply(-1, this.velocityX, this.springVelocityScale)) : set(this.initialVelocityForSpring, multiply(this.velocityX, this.springVelocityScale))), spring(this.clock, {
        ...state,
        velocity: this.initialVelocityForSpring
      }, {
        ...SPRING_CONFIG,
        ...this.springConfig,
        toValue
      })],
      // Otherwise use a timing animation for faster switching
      timing(this.clock, {
        ...state,
        frameTime
      }, {
        ...TIMING_CONFIG,
        ...this.timingConfig,
        toValue
      })), cond(not(clockRunning(this.clock)), startClock(this.clock)), cond(state.finished, [
      // Reset values
      set(this.isSwipeGesture, FALSE), set(this.gestureX, 0), set(this.velocityX, 0),
      // When the animation finishes, stop the clock
      stopClock(this.clock)])]);
    });
    _defineProperty(this, "handleGestureEvent", event([{
      nativeEvent: {
        translationX: this.gestureX,
        velocityX: this.velocityX,
        state: this.gestureState
      }
    }]));
    _defineProperty(this, "extrapolatedPosition", add(this.gestureX, multiply(this.velocityX, this.swipeVelocityImpact)));
    _defineProperty(this, "toggleEnabled", () => {
      if (this.state.enabled && this.mounted) this.setState({
        enabled: false
      }, () => {
        this.setState({
          enabled: true
        });
      });
    });
    _defineProperty(this, "maybeCancel", block([cond(and(this.gesturesEnabled, or(and(eq(this.index, sub(this.routesLength, 1)), lessThan(this.gestureX, 0)), and(eq(this.index, 0), greaterThan(this.gestureX, 0)))), set(this.gesturesEnabled, 0))]));
    _defineProperty(this, "translateX", block([onChange(this.gesturesEnabled, cond(not(this.gesturesEnabled), call([this.gesturesEnabled], this.toggleEnabled))), onChange(this.index, call([this.index], ([value]) => {
      this.currentIndexValue = value;
      // Without this check, the pager can go to an infinite update <-> animate loop for sync updates
      if (value !== this.props.navigationState.index) {
        // If the index changed, and previous animation has finished, update state
        this.props.onIndexChange(value);
        this.pendingIndexValue = value;

        // Force componentDidUpdate to fire, whether user does a setState or not
        // This allows us to detect when the user drops the update and revert back
        // It's necessary to make sure that the state stays in sync
        if (this.mounted) {
          this.forceUpdate();
        }
      }
    })), onChange(this.position,
    // Listen to updates in the position to detect when we enter a screen
    // This is useful for things such as lazy loading when index change will fire too late
    cond(_reactNative.I18nManager.isRTL ? lessThan(this.gestureX, 0) : greaterThan(this.gestureX, 0),
    // Based on the direction of the gesture, determine if we're entering the previous or next screen
    cond(neq(floor(this.position), this.lastEnteredIndex), [set(this.lastEnteredIndex, floor(this.position)), call([floor(this.position)], this.handleEnteredIndexChange)]), cond(neq(ceil(this.position), this.lastEnteredIndex), [set(this.lastEnteredIndex, ceil(this.position)), call([ceil(this.position)], this.handleEnteredIndexChange)]))), onChange(this.isSwiping,
    // Listen to updates for this value only when it changes
    // Without `onChange`, this will fire even if the value didn't change
    // We don't want to call the listeners if the value didn't change
    [cond(not(this.isSwiping), set(this.gesturesEnabled, 1)), call([this.isSwiping, this.indexAtSwipeEnd, this.index], ([isSwiping, indexAtSwipeEnd, currentIndex]) => {
      const {
        keyboardDismissMode,
        onSwipeStart,
        onSwipeEnd
      } = this.props;
      if (isSwiping === TRUE) {
        onSwipeStart === null || onSwipeStart === void 0 ? void 0 : onSwipeStart();
        this.interactionHandle = _reactNative.InteractionManager.createInteractionHandle();
        if (keyboardDismissMode === 'auto') {
          // @ts-ignore: the method is only available in newer React Native, but types aren't up-to-date
          const input = _reactNative.TextInput.State.currentlyFocusedInput ?
          // @ts-ignore
          _reactNative.TextInput.State.currentlyFocusedInput() : _reactNative.TextInput.State.currentlyFocusedField();

          // When a gesture begins, blur the currently focused input
          _reactNative.TextInput.State.blurTextInput(input);

          // Store the id of this input so we can refocus it if gesture was cancelled
          this.previouslyFocusedTextInput = input;
        } else if (keyboardDismissMode === 'on-drag') {
          _reactNative.Keyboard.dismiss();
        }
      } else {
        onSwipeEnd === null || onSwipeEnd === void 0 ? void 0 : onSwipeEnd();
        if (this.interactionHandle !== null) {
          _reactNative.InteractionManager.clearInteractionHandle(this.interactionHandle);
        }
        if (keyboardDismissMode === 'auto') {
          if (indexAtSwipeEnd === currentIndex) {
            // The index didn't change, we should restore the focus of text input
            const input = this.previouslyFocusedTextInput;
            if (input) {
              _reactNative.TextInput.State.focusTextInput(input);
            }
          }
          this.previouslyFocusedTextInput = null;
        }
      }
    })]), onChange(this.nextIndex, cond(neq(this.nextIndex, UNSET), [
    // Stop any running animations
    cond(clockRunning(this.clock), stopClock(this.clock)), set(this.gestureX, 0),
    // Update the index to trigger the transition
    set(this.index, this.nextIndex), set(this.nextIndex, UNSET)])), cond(eq(this.gestureState, _reactNativeGestureHandler.State.ACTIVE), [this.maybeCancel, cond(this.isSwiping, NOOP, [
    // We weren't dragging before, set it to true
    set(this.isSwiping, TRUE), set(this.isSwipeGesture, TRUE),
    // Also update the drag offset to the last progress
    set(this.offsetX, this.progress)]),
    // Update progress with previous offset + gesture distance
    set(this.progress, _reactNative.I18nManager.isRTL ? sub(this.offsetX, this.gestureX) : add(this.offsetX, this.gestureX)),
    // Stop animations while we're dragging
    stopClock(this.clock)], [set(this.isSwiping, FALSE), set(this.indexAtSwipeEnd, this.index), this.transitionTo(cond(and(
    // We should consider velocity and gesture distance only when a swipe ends
    // The gestureX value will be non-zero when swipe has happened
    // We check against a minimum distance instead of 0 because `activeOffsetX` doesn't seem to be respected on Android
    // For other factors such as state update, the velocity and gesture distance don't matter
    greaterThan(abs(this.gestureX), SWIPE_DISTANCE_MINIMUM), greaterThan(abs(this.extrapolatedPosition), divide(this.layoutWidth, 2))),
    // For swipe gesture, to calculate the index, determine direction and add to index
    // When the user swipes towards the left, we transition to the next tab
    // When the user swipes towards the right, we transition to the previous tab
    round(min(max(0, sub(this.index, cond(greaterThan(this.extrapolatedPosition, 0), _reactNative.I18nManager.isRTL ? DIRECTION_RIGHT : DIRECTION_LEFT, _reactNative.I18nManager.isRTL ? DIRECTION_LEFT : DIRECTION_RIGHT))), sub(this.routesLength, 1))),
    // Index didn't change/changed due to state update
    this.index))]), this.progress]));
    _defineProperty(this, "getTranslateX", (0, _memoize.default)((layoutWidth, routesLength, translateX) => multiply(
    // Make sure that the translation doesn't exceed the bounds to prevent overscrolling
    min(max(multiply(layoutWidth, sub(routesLength, 1), DIRECTION_RIGHT), translateX), 0), _reactNative.I18nManager.isRTL ? -1 : 1)));
  }
  componentDidMount() {
    this.mounted = true;

    // Register this PanGestureHandler with the parent (if parent exists)
    // in order to coordinate gestures between handlers.
    if (this.context && this.context.addGestureHandlerRef) {
      this.context.addGestureHandlerRef(this.gestureHandlerRef);
    }
  }
  componentDidUpdate(prevProps) {
    const {
      navigationState,
      layout,
      swipeVelocityImpact,
      springVelocityScale,
      springConfig,
      timingConfig
    } = this.props;
    const {
      index,
      routes
    } = navigationState;
    if (
    // Check for index in state to avoid unintended transition if component updates during swipe
    index !== prevProps.navigationState.index && index !== this.currentIndexValue ||
    // Check if the user updated the index correctly after an update
    typeof this.pendingIndexValue === 'number' && index !== this.pendingIndexValue) {
      // Index in user's state is different from the index being tracked
      this.jumpToIndex(index);
    }

    // Reset the pending index
    this.pendingIndexValue = undefined;

    // Update our mappings of animated nodes when props change
    if (prevProps.navigationState.routes.length !== routes.length) {
      this.routesLength.setValue(routes.length);
    }
    if (prevProps.layout.width !== layout.width) {
      this.progress.setValue(-index * layout.width);
      this.layoutWidth.setValue(layout.width);
    }
    if (prevProps.swipeVelocityImpact !== swipeVelocityImpact) {
      this.swipeVelocityImpact.setValue(swipeVelocityImpact !== undefined ? swipeVelocityImpact : SWIPE_VELOCITY_IMPACT);
    }
    if (prevProps.springVelocityScale !== springVelocityScale) {
      this.springVelocityScale.setValue(springVelocityScale !== undefined ? springVelocityScale : SPRING_VELOCITY_SCALE);
    }
    if (prevProps.springConfig !== springConfig) {
      this.springConfig.damping.setValue(springConfig.damping !== undefined ? springConfig.damping : SPRING_CONFIG.damping);
      this.springConfig.mass.setValue(springConfig.mass !== undefined ? springConfig.mass : SPRING_CONFIG.mass);
      this.springConfig.stiffness.setValue(springConfig.stiffness !== undefined ? springConfig.stiffness : SPRING_CONFIG.stiffness);
      this.springConfig.restSpeedThreshold.setValue(springConfig.restSpeedThreshold !== undefined ? springConfig.restSpeedThreshold : SPRING_CONFIG.restSpeedThreshold);
      this.springConfig.restDisplacementThreshold.setValue(springConfig.restDisplacementThreshold !== undefined ? springConfig.restDisplacementThreshold : SPRING_CONFIG.restDisplacementThreshold);
    }
    if (prevProps.timingConfig !== timingConfig) {
      this.timingConfig.duration.setValue(timingConfig.duration !== undefined ? timingConfig.duration : TIMING_CONFIG.duration);
    }
  }
  componentWillUnmount() {
    this.mounted = false;
    if (this.interactionHandle !== null) {
      _reactNative.InteractionManager.clearInteractionHandle(this.interactionHandle);
    }
  }

  // Mechanism to add child PanGestureHandler refs in the case that this
  // Pager is a parent to child Pagers. Allows for coordination between handlers

  // PanGestureHandler ref used for coordination with parent handlers

  // Clock used for tab transition animations

  // Current state of the gesture

  // Tracks current state of gesture handler enabled

  // Current progress of the page (translateX value)

  // Initial index of the tabs

  // Next index of the tabs, updated for navigation from outside (tab press, state update)

  // Scene that was last entered

  // Whether the user is currently dragging the screen

  // Whether the update was due to swipe gesture
  // This controls whether the transition will use a spring or timing animation
  // Remember to set it before transition needs to occur

  // Track the index value when a swipe gesture has ended
  // This lets us know if a gesture end triggered a tab switch or not

  // Mappings to some prop values
  // We use them in animation calculations, so we need live animated nodes

  // Determines how relevant is a velocity while calculating next position while swiping

  // The position value represent the position of the pager on a scale of 0 - routes.length-1
  // It is calculated based on the translate value and layout width
  // If we don't have the layout yet, we should return the current index

  // Animation configuration

  // The reason for using this value instead of simply passing `this._velocity`
  // into a spring animation is that we need to reverse it if we're using RTL mode.
  // Also, it's not possible to pass multiplied value there, because
  // value passed to STATE of spring (the first argument) has to be Animated.Value
  // and it's not allowed to pass other nodes there. The result of multiplying is not an
  // Animated.Value. So this value is being updated on each start of spring animation.

  // The current index change caused by the pager's animation
  // The pager is used as a controlled component
  // We need to keep track of the index to determine when to trigger animation
  // The state will change at various points, we should only respond when we are out of sync
  // This will ensure smoother animation and avoid weird glitches

  // The pending index value as result of state update caused by swipe gesture
  // We need to set it when state changes from inside this component
  // It also needs to be reset right after componentDidUpdate fires

  // Numeric id of the previously focused text input
  // When a gesture didn't change the tab, we can restore the focused input with this

  // Listeners for the entered screen

  // InteractionHandle to handle tasks around animations

  // Cancel gesture if swiping back from the initial tab or forward from the last tab.
  // Enables parent Pager to pick up the gesture if one exists.

  render() {
    const {
      layout,
      navigationState,
      swipeEnabled,
      children,
      removeClippedSubviews,
      gestureHandlerProps
    } = this.props;
    const translateX = this.getTranslateX(this.layoutWidth, this.routesLength, this.translateX);
    return children({
      position: this.position,
      addListener: this.addListener,
      removeListener: this.removeListener,
      jumpTo: this.jumpTo,
      render: children => /*#__PURE__*/React.createElement(_reactNativeGestureHandler.PanGestureHandler, _extends({
        ref: this.gestureHandlerRef,
        simultaneousHandlers: this.state.childPanGestureHandlerRefs,
        waitFor: this.state.childPanGestureHandlerRefs,
        enabled: layout.width !== 0 && swipeEnabled && this.state.enabled,
        onGestureEvent: this.handleGestureEvent,
        onHandlerStateChange: this.handleGestureEvent,
        activeOffsetX: [-SWIPE_DISTANCE_MINIMUM, SWIPE_DISTANCE_MINIMUM],
        failOffsetY: [-SWIPE_DISTANCE_MINIMUM, SWIPE_DISTANCE_MINIMUM]
      }, gestureHandlerProps), /*#__PURE__*/React.createElement(_reactNativeReanimated.default.View, {
        removeClippedSubviews: removeClippedSubviews,
        style: [styles.container, layout.width ? {
          width: layout.width * navigationState.routes.length,
          transform: [{
            translateX
          }]
        } : null]
      }, /*#__PURE__*/React.createElement(PagerContext.Provider, {
        value: this.providerVal
      }, children)))
    });
  }
}
exports.default = Pager;
_defineProperty(Pager, "defaultProps", {
  swipeVelocityImpact: SWIPE_VELOCITY_IMPACT,
  springVelocityScale: SPRING_VELOCITY_SCALE
});
_defineProperty(Pager, "contextType", PagerContext);
const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  }
});
//# sourceMappingURL=Pager.js.map