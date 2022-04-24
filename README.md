# vtouchdir

移动端 vue3 touch api 滑动方向自定义指令

## Installation

```bash
npm install --save-dev vtouchdir
```

## Docs

### touchDir

**Description**

传入一个函数，会在该元素监听到滑动方向时改变时调用该函数，传入一个方向参数 `'left' | 'right' | 'up' | 'down'`

**Usage**

```vue
<script setup lang="ts">
import vTouchdir from "vtouchdir"

function handler(dir: 'left' | 'right' | 'up' | 'down') {}
</script>

<template>
  <div v-touchdir="handler" />
</template>
```

支持除 `passive` 外与 `vue` 相同的 [事件修饰符](https://staging-cn.vuejs.org/guide/essentials/event-handling.html#event-modifiers)，`.self` 优先级最高

```vue
<script setup lang="ts">
import vTouchdir from "vtouchdir"

function handler(dir: 'left' | 'right' | 'up' | 'down') {}
</script>

<template>
  <div v-touchdir.once.stop.prevent="handler" />
</template>
```

默认滑动的范围为 **10** ，滑动超过 **10** 才会触发 `handler`，可指定一个 `range` 参数自定义范围

```vue
<script setup lang="ts">
import vTouchdir from "vtouchdir"

function handler(dir: 'left' | 'right' | 'up' | 'down') {}
</script>

<template>
  <div v-touchdir.once.stop.prevent="{ handler, range: 0 }" />
</template>
```

**Typescript**

如果使用 `ts` 的话可以导出 `Direction` 枚举

```ts
// vtouchdir
export const enum Direction {
  LEFT = "left",
  RIGHT = "right",
  UP = "up",
  DOWN = "down",
}

// use
import vTouchdir, { Direction } from "vtouchdir"
```
