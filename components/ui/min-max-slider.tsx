"use client"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

interface PriceRangeSliderProps {
  min?: number
  max?: number
  step?: number
  value: [number, number]
  onValueChange: (value: [number, number]) => void
  className?: string
}

export function PriceRangeSlider({
  min = 0,
  max = 1000000,
  step = 10000,
  value,
  onValueChange,
  className,
}: PriceRangeSliderProps) {
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`
    }
    if (price >= 1000) {
      return `₦${(price / 1000).toFixed(0)}K`
    }
    return `₦${price.toLocaleString()}`
  }

  return (
    <div className={className}>
      <div className="space-y-3">
        <Label className="text-sm font-medium text-muted-foreground">Price Range</Label>
        <div className="px-2">
          <Slider min={min} max={max} step={step} value={value} onValueChange={onValueChange} className="w-full" />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatPrice(value[0])}</span>
          <span>{formatPrice(value[1])}</span>
        </div>
      </div>
    </div>
  )
}
