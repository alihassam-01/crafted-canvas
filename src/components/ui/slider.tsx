import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  className?: string;
  disabled?: boolean;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({
    min = 0,
    max = 100,
    step = 1,
    value,
    defaultValue = [min, max],
    onValueChange,
    className,
    disabled = false
  }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value || defaultValue);
    const [isDraggingMin, setIsDraggingMin] = React.useState(false);
    const [isDraggingMax, setIsDraggingMax] = React.useState(false);
    const sliderRef = React.useRef<HTMLDivElement>(null);

    // Use controlled value if provided, otherwise use internal state
    const currentValue = value || internalValue;
    const minValue = currentValue[0] ?? min;
    const maxValue = currentValue[1] ?? max;

    const MIN_GAP = step;

    const getPositionFromValue = (val: number) => {
      return ((val - min) / (max - min)) * 100;
    };

    const getValueFromPosition = (clientX: number) => {
      if (!sliderRef.current) return min;
      const rect = sliderRef.current.getBoundingClientRect();
      const position = (clientX - rect.left) / rect.width;
      const rawValue = position * (max - min) + min;
      const steppedValue = Math.round(rawValue / step) * step;
      return Math.max(min, Math.min(max, steppedValue));
    };

    const handleMouseDown = (type: 'min' | 'max') => (e: React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      if (type === 'min') {
        setIsDraggingMin(true);
      } else {
        setIsDraggingMax(true);
      }
    };

    React.useEffect(() => {
      if (!isDraggingMin && !isDraggingMax) return;

      const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        const newValue = getValueFromPosition(e.clientX);

        if (isDraggingMin && newValue < maxValue - MIN_GAP) {
          const updatedValue = [newValue, maxValue];
          if (!value) {
            setInternalValue(updatedValue);
          }
          onValueChange?.(updatedValue);
        } else if (isDraggingMax && newValue > minValue + MIN_GAP) {
          const updatedValue = [minValue, newValue];
          if (!value) {
            setInternalValue(updatedValue);
          }
          onValueChange?.(updatedValue);
        }
      };

      const handleMouseUp = () => {
        setIsDraggingMin(false);
        setIsDraggingMax(false);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }, [isDraggingMin, isDraggingMax, minValue, maxValue, value, onValueChange, MIN_GAP]);

    // Update internal value when controlled value changes
    React.useEffect(() => {
      if (value) {
        setInternalValue(value);
      }
    }, [value]);

    const minPos = getPositionFromValue(minValue);
    const maxPos = getPositionFromValue(maxValue);

    return (
      <div
        ref={ref}
        className={cn("relative w-full py-2", className)}
      >
        <div
          ref={sliderRef}
          className="relative h-2 bg-secondary/50 rounded-full cursor-pointer"
        >
          {/* Active range bar */}
          <div
            className="absolute h-full bg-primary rounded-full"
            style={{
              left: `${minPos}%`,
              width: `${maxPos - minPos}%`
            }}
          />

          {/* Min knob */}
          <div
            className={cn(
              "absolute top-1/2 w-5 h-5 bg-background border-2 border-primary rounded-full shadow-lg transition-transform",
              isDraggingMin ? "scale-125 cursor-grabbing" : "cursor-grab hover:scale-110 hover:shadow-xl",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            style={{
              left: `${minPos}%`,
              transform: 'translate(-50%, -50%)',
              touchAction: 'none'
            }}
            onMouseDown={handleMouseDown('min')}
          />

          {/* Max knob */}
          <div
            className={cn(
              "absolute top-1/2 w-5 h-5 bg-background border-2 border-primary rounded-full shadow-lg transition-transform",
              isDraggingMax ? "scale-125 cursor-grabbing" : "cursor-grab hover:scale-110 hover:shadow-xl",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            style={{
              left: `${maxPos}%`,
              transform: 'translate(-50%, -50%)',
              touchAction: 'none'
            }}
            onMouseDown={handleMouseDown('max')}
          />
        </div>
      </div>
    );
  }
);

Slider.displayName = "Slider";

export { Slider };