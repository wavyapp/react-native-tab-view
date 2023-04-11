import * as React from 'react';
import { Animated, StyleProp, LayoutChangeEvent, TextStyle, ViewStyle } from 'react-native';
import type { Scene, Route, NavigationState } from './types';
export declare type Props<T extends Route> = {
    position: Animated.AnimatedInterpolation<number>;
    route: T;
    navigationState: NavigationState<T>;
    activeColor?: string;
    inactiveColor?: string;
    pressColor?: string;
    pressOpacity?: number;
    getLabelText: (scene: Scene<T>) => string | undefined;
    getAccessible: (scene: Scene<T>) => boolean | undefined;
    getAccessibilityLabel: (scene: Scene<T>) => string | undefined;
    getTestID: (scene: Scene<T>) => string | undefined;
    renderLabel?: (scene: {
        route: T;
        focused: boolean;
        color: string;
    }) => React.ReactNode;
    renderIcon?: (scene: {
        route: T;
        focused: boolean;
        color: string;
    }) => React.ReactNode;
    renderBadge?: (scene: Scene<T>) => React.ReactNode;
    onLayout?: (event: LayoutChangeEvent) => void;
    onPress: () => void;
    onLongPress: () => void;
    defaultTabWidth?: number;
    labelStyle?: StyleProp<TextStyle>;
    style: StyleProp<ViewStyle>;
};
declare function TabBarItem<T extends Route>(props: Props<T>): JSX.Element;
export default TabBarItem;
//# sourceMappingURL=TabBarItem.d.ts.map