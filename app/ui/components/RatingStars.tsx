import React from "react";
import { View, Pressable } from "react-native";
import { Icon } from "./Icon";
import { useTheme } from "../theme/useTheme";

interface RatingStarsProps {
  rating: number;
  size?: number;
  className?: string;
  color?: string;
  emptyColor?: string;
  onRatingChange?: (rating: number) => void;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  size = 16,
  className,
  color,
  emptyColor,
  onRatingChange,
}) => {
  const { colors } = useTheme();
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const starColor = color || colors.primary;

  const handleStarPress = (index: number) => {
    if (onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  const StarWrapper = ({
    children,
    index,
  }: {
    children: React.ReactNode;
    index: number;
  }) => {
    if (!onRatingChange) return <>{children}</>;

    return (
      <Pressable onPress={() => handleStarPress(index)}>{children}</Pressable>
    );
  };

  return (
    <View className={`flex-row ${className || ""}`}>
      {[...Array(fullStars)].map((_, i) => (
        <StarWrapper key={`full-${i}`} index={i}>
          <Icon
            icon="star"
            color={starColor}
            size={size}
            style={{ marginRight: 2 }}
          />
        </StarWrapper>
      ))}
      {hasHalfStar && (
        <StarWrapper index={fullStars}>
          <Icon
            icon="half_star"
            color={starColor}
            size={size}
            style={{ marginRight: 2 }}
          />
        </StarWrapper>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <StarWrapper
          key={`empty-${i}`}
          index={fullStars + (hasHalfStar ? 1 : 0) + i}
        >
          <Icon
            key={`empty-${i}`}
            icon="star"
            color={emptyColor ?? "#AAAAAA"}
            size={size}
            style={{ marginRight: 2 }}
          />
        </StarWrapper>
      ))}
    </View>
  );
};
