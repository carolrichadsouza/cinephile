import type useEmblaCarousel from "embla-carousel-react"
import type { UseEmblaCarouselType, } from "embla-carousel-react"

export type CarouselApi = UseEmblaCarouselType[1]

type UseCarouselParameters = Parameters<typeof useEmblaCarousel>

export type CarouselOptions = UseCarouselParameters[0]
export type CarouselPlugin = UseCarouselParameters[1]

export type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}