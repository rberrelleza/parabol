import {RefObject, useLayoutEffect, useState} from 'react'
import {ElementWidth} from '../types/constEnums'
import useResizeObserver from './useResizeObserver'
import {MAX_SPOTLIGHT_COLUMNS} from '~/utils/constants'

const useSpotlightColumns = (columnsRef: RefObject<HTMLDivElement>, groupsCount: number) => {
  const [columns, setColumns] = useState<null | number[]>(null)

  const getColumns = () => {
    const {current: el} = columnsRef
    const width = el?.clientWidth
    if (!width) return
    if (groupsCount <= 2) {
      setColumns([0])
    } else {
      const minColumns = 1
      const minGroupsPerColumn = 2
      const maxColumnsInRef = Math.floor(width / ElementWidth.MEETING_CARD_WITH_MARGIN)
      const maxPossibleColumns = Math.max(
        Math.min(maxColumnsInRef, MAX_SPOTLIGHT_COLUMNS),
        minColumns
      )
      const groupsInSmallestColumn = Math.floor(groupsCount / maxPossibleColumns)
      // if there's just 1/2 groups in a column, reduce the no. of columns
      const columnsCount =
        groupsInSmallestColumn < minGroupsPerColumn && maxPossibleColumns !== minColumns
          ? maxPossibleColumns - 1
          : maxPossibleColumns
      const newColumns = [...Array(columnsCount).keys()]
      setColumns(newColumns)
    }
  }

  useLayoutEffect(getColumns, [columnsRef, groupsCount])
  useResizeObserver(getColumns, columnsRef)
  return columns
}

export default useSpotlightColumns
