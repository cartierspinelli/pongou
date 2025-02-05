import { FontStyle } from "@react-native-segmented-control/segmented-control";

type SegmentControlProps = {
  enabled?: boolean;
  onIndexChange?: (index: number) => void;
  onValueChange?: (value: string) => void;
  selectedIndex?: number;
  values: string[];
  materialTextClassName?: string;
  /**
   * If true, then selecting a segment won't persist visually. The onValueChange callback will still work as expected.
   */
  iosMomentary?: boolean;
  fontStyle?: FontStyle;
  activeFontStyle?: FontStyle;
  appearance?: 'dark' | 'light';
};

export type { SegmentControlProps };
