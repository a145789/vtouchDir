import type { ObjectDirective } from "vue"

export enum Direction {
  LEFT = 'left',
  RIGHT = 'right',
  UP = 'up',
  DOWN = 'down'
}

const ctxKey = Symbol(`_cDt_${Math.random().toString().slice(4)}`)

interface BindOption {
  handler: ((direction: Direction) => void) | null
  range: number
}

interface Modifiers {
  prevent: boolean
  stop: boolean
  capture: boolean
  once: boolean
  self: boolean
}

interface CustomHTMLElement extends HTMLElement {
  [ctxKey]:
  | ({
    startPageX: number
    startPageY: number
  } & BindOption &
    Modifiers)
  | null
}

function touchStartHandle(e: TouchEvent) {
  const { target, currentTarget, touches } = e
  if (touches.length !== 1) {
    return
  }
  const option = (currentTarget as CustomHTMLElement)[ctxKey]!
  if (option.self && currentTarget !== target) {
    return
  }

  option.prevent && e.preventDefault()
  option.stop && e.stopPropagation()

  option.startPageX = Math.round(touches[0].pageX)
  option.startPageY = Math.round(touches[0].pageY)
}
function touchEndHandle(e: TouchEvent) {
  const { changedTouches, currentTarget, target } = e
  if (changedTouches.length !== 1) {
    return
  }
  const { startPageX, startPageY, handler, range, prevent, stop, self } = (
    currentTarget as CustomHTMLElement
  )[ctxKey]!
  if (self && currentTarget !== target) {
    return
  }

  prevent && e.preventDefault()
  stop && e.stopPropagation()

  const endPageX = Math.round(changedTouches[0].pageX)
  const endPageY = Math.round(changedTouches[0].pageY)
  const deltaX = endPageX - startPageX
  const deltaY = endPageY - startPageY
  if (Math.abs(deltaY) < range && Math.abs(deltaX) < range) {
    return
  }
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) {
      // 向右滑动
      handler?.(Direction.RIGHT)
    } else {
      // 向左滑动
      handler?.(Direction.LEFT)
    }
  } else {
    if (deltaY > 0) {
      // 向下滑动
      handler?.(Direction.DOWN)
    } else {
      // 向上滑动
      handler?.(Direction.UP)
    }
  }
}
const vTouchDir: ObjectDirective<CustomHTMLElement, BindOption> = {
  mounted(
    el,
    {
      value,
      modifiers: {
        prevent = false,
        stop = false,
        capture = false,
        once = false,
        self = false,
      },
    }
  ) {
    if (!value) {
      return
    }

    if (!el[ctxKey]) {
      const option: any = {
        startPageX: 0,
        startPageY: 0,
      }
      if (typeof value === "function") {
        option.handler = value
      } else {
        const { handler, range } = value
        option.handler = handler
        option.range = isNull(range) ? 10 : range
      }
      el[ctxKey] = {
        ...option,
        prevent,
        stop,
        capture,
        once,
        self,
      }
    }
    el.addEventListener("touchstart", touchStartHandle, { capture, once })
    el.addEventListener("touchend", touchEndHandle, { capture, once })
  },
  beforeUnmount(el) {
    el.removeEventListener("touchstart", touchStartHandle)
    el.removeEventListener("touchend", touchEndHandle)
    el[ctxKey] = null
  },
}

export default vTouchDir

function isNull(ele: unknown): boolean {
  return ele === null || ele === undefined
}
