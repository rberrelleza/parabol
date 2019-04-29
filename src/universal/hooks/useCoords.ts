import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import {BBox} from 'types/animations'
import getBBox from 'universal/components/RetroReflectPhase/getBBox'
import {getOffset} from 'universal/decorators/withCoordsV2'
import useRefState from 'universal/hooks/useRefState'
import useResizeObserver from 'universal/hooks/useResizeObserver'

export type UseCoordsValue =
  | {top: number; left: number}
  | {top: number; right: number}
  | {bottom: number; right: number}
  | {bottom: number; left: number}

interface CoordState {
  coords: UseCoordsValue
  menuPosition: MenuPosition
}

export interface ModalAnchor {
  horizontal: 'left' | 'center' | 'right'
  vertical: 'top' | 'center' | 'bottom'
}

export enum MenuPosition {
  UPPER_LEFT,
  UPPER_RIGHT,
  LOWER_LEFT,
  LOWER_RIGHT
}

const anchorLookup = {
  [MenuPosition.UPPER_LEFT]: {
    targetAnchor: {
      horizontal: 'left',
      vertical: 'top'
    },
    originAnchor: {
      horizontal: 'left',
      vertical: 'bottom'
    }
  },
  [MenuPosition.UPPER_RIGHT]: {
    targetAnchor: {
      horizontal: 'right',
      vertical: 'top'
    },
    originAnchor: {
      horizontal: 'right',
      vertical: 'bottom'
    }
  },
  [MenuPosition.LOWER_LEFT]: {
    targetAnchor: {
      horizontal: 'left',
      vertical: 'bottom'
    },
    originAnchor: {
      horizontal: 'left',
      vertical: 'top'
    }
  },
  [MenuPosition.LOWER_RIGHT]: {
    targetAnchor: {
      horizontal: 'right',
      vertical: 'bottom'
    },
    originAnchor: {
      horizontal: 'right',
      vertical: 'top'
    }
  }
}

const lowerLookup = {
  [MenuPosition.UPPER_LEFT]: MenuPosition.LOWER_LEFT,
  [MenuPosition.UPPER_RIGHT]: MenuPosition.LOWER_RIGHT
}

const getNextCoords = (targetBBox: BBox, originBBox: BBox, preferredMenuPosition: MenuPosition) => {
  const {height: modalHeight, width: modalWidth} = targetBBox
  const {height: originHeight, width: originWidth, left: originLeft, top: originTop} = originBBox
  const {originAnchor, targetAnchor} = anchorLookup[preferredMenuPosition]
  const nextCoords = {} as any

  const originLeftOffset = getOffset(originAnchor.horizontal, originWidth)
  const {scrollX, scrollY, innerHeight} = window
  // Do not use window.innerWidth because that does not account for the scrollbar width
  const pageWidth = document.documentElement.clientWidth
  if (targetAnchor.horizontal !== 'right') {
    const targetLeftOffset = getOffset(targetAnchor.horizontal, modalWidth)
    const left = scrollX + originLeft + originLeftOffset - targetLeftOffset
    const maxLeft = pageWidth - modalWidth + scrollX
    nextCoords.left = Math.min(left, maxLeft)
  } else {
    const right = pageWidth - (originLeft + originLeftOffset) - scrollX
    const maxRight = pageWidth - modalWidth - scrollX
    nextCoords.right = Math.min(right, maxRight)
  }

  if (targetAnchor.vertical !== 'bottom') {
    const originTopOffset = getOffset(originAnchor.vertical, originHeight)
    const targetTopOffset = getOffset(targetAnchor.vertical, modalHeight)
    const top = scrollY + originTop + originTopOffset - targetTopOffset
    const isBelow = top + modalHeight < innerHeight + scrollY
    if (isBelow) {
      nextCoords.top = top
    }
  }
  const menuPosition =
    nextCoords.top === undefined ? lowerLookup[preferredMenuPosition] : preferredMenuPosition
  // if by choice or circumstance, put it above & anchor it from the bottom
  if (nextCoords.top === undefined) {
    const bottom = innerHeight - originTop - scrollY
    const maxBottom = innerHeight - modalHeight + scrollY
    nextCoords.bottom = Math.min(bottom, maxBottom)
  }
  return {coords: nextCoords as UseCoordsValue, menuPosition}
}

export interface UseCoordsOptions {
  originCoords?: BBox
}

const useWindowResize = (
  coordsRef: MutableRefObject<CoordState>,
  currentTargetRef: HTMLDivElement | null,
  setCoords: Dispatch<SetStateAction<CoordState>>
) => {
  useEffect(() => {
    const resizeWindow = () => {
      const {coords, menuPosition} = coordsRef.current
      if (currentTargetRef && ('right' in coords || 'bottom' in coords)) {
        const targetCoords = currentTargetRef.getBoundingClientRect()
        setCoords({
          coords: {
            left: targetCoords.left,
            top: targetCoords.top
          },
          menuPosition
        })
      }
    }
    window.addEventListener('resize', resizeWindow, {passive: true})
    return () => {
      window.removeEventListener('resize', resizeWindow)
    }
  }, [coordsRef, currentTargetRef, setCoords])
}

const useCoords = (preferredMenuPosition: MenuPosition, options: UseCoordsOptions = {}) => {
  const [currentTargetRef, setTargetRef] = useState<HTMLDivElement | null>(null)
  const targetRef = useCallback((c) => {
    setTargetRef(c)
  }, [])
  const originRef = useRef<HTMLElement | null>(null)
  const [coordsRef, setCoords] = useRefState<CoordState>({
    coords: {left: 0, top: 0},
    menuPosition: preferredMenuPosition
  })
  useLayoutEffect(() => {
    if (!currentTargetRef || !originRef.current) return
    // Bounding adjustments mimic native (flip from below to above for Y, but adjust pixel-by-pixel for X)
    const targetBBox = getBBox(currentTargetRef)
    const originBBox = getBBox(originRef.current)
    if (targetBBox && originBBox) {
      const coordState = getNextCoords(targetBBox, originBBox, preferredMenuPosition)
      setCoords(coordState)
    }
  }, [options.originCoords])

  useResizeObserver(currentTargetRef, () => {
    const targetBBox = getBBox(currentTargetRef)!
    const originBBox = getBBox(originRef.current)!
    if (targetBBox && originBBox) {
      const coordState = getNextCoords(targetBBox, originBBox, preferredMenuPosition)
      setCoords(coordState)
    }
  })

  useWindowResize(coordsRef, currentTargetRef, setCoords)
  const {coords, menuPosition} = coordsRef.current
  return {targetRef, originRef, coords, menuPosition}
}

export default useCoords
