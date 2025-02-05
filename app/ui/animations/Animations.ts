/* eslint-disable @typescript-eslint/no-unused-vars */
import { EntryAnimationsValues, LayoutAnimation, StyleProps, withTiming } from "react-native-reanimated";

export const CustomFadeIn: (targetOpacity: number) => (targetValues: EntryAnimationsValues) => LayoutAnimation = (targetOpacity) => (values) => {
    'worklet';
    const animations: StyleProps = {
        opacity: withTiming(targetOpacity),
    };
    const initialValues: StyleProps = {
        opacity: 0,
    };
    return {
        initialValues,
        animations,
    }
}

export const CustomFadeOut: (targetOpacity: number) => (targetValues: EntryAnimationsValues) => LayoutAnimation = (targetOpacity) => (values) => {
    'worklet';
    const animations: StyleProps = {
        opacity: withTiming(0),
    };
    const initialValues: StyleProps = {
        opacity: targetOpacity,
    };
    return {
        initialValues,
        animations,
    }
}