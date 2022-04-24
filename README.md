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
import vTouchDir from "vtouchdir"

export default {
  directives: {
    vTouchDir,
  },
}
</script>

<template>
  <div v-touchDir="(dir: 'left' | 'right' | 'up' | 'down') => handle(dir)" />
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
import vTouchDir, { Direction } from "vtouchdir"
```
