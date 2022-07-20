import { mount } from '@vue/test-utils'
import Touchdir, { Direction } from '../index'
import { describe, test, expect } from 'vitest'
import { defineComponent } from 'vue'

describe('test normal', () => {
  const Wrapper = defineComponent({
    name: 'wrapper',
    directives: { Touchdir },
    data() {
      return {
        dir: null as Direction | null
      }
    },
    methods: {
      move(dir: Direction) {
        this.dir = dir
      }
    },
    template: `
      <div class="container" style="width: 100px; height: 100px" v-touchdir="move"></div>
    `
  })

  test('test direction up', async () => {
    const wrapper = mount(Wrapper, { attachTo: document.body })
    await wrapper
      .find('.container')
      .trigger('touchstart', { touches: [{ pageX: 60, pageY: 100 }] })
    await wrapper
      .find('.container')
      .trigger('touchend', { changedTouches: [{ pageX: 60, pageY: 0 }] })
    expect(wrapper.vm.dir).eq(Direction.UP)
    wrapper.unmount()
  })

  test('test direction down', async () => {
    const wrapper = mount(Wrapper, { attachTo: document.body })
    await wrapper
      .find('.container')
      .trigger('touchstart', { touches: [{ pageX: 60, pageY: 0 }] })
    await wrapper
      .find('.container')
      .trigger('touchend', { changedTouches: [{ pageX: 60, pageY: 100 }] })
    expect(wrapper.vm.dir).eq(Direction.DOWN)
    wrapper.unmount()
  })

  test('test direction left', async () => {
    const wrapper = mount(Wrapper, { attachTo: document.body })
    await wrapper
      .find('.container')
      .trigger('touchstart', { touches: [{ pageX: 100, pageY: 60 }] })
    await wrapper
      .find('.container')
      .trigger('touchend', { changedTouches: [{ pageX: 0, pageY: 60 }] })
    expect(wrapper.vm.dir).eq(Direction.LEFT)
    wrapper.unmount()
  })

  test('test direction right', async () => {
    const wrapper = mount(Wrapper, { attachTo: document.body })
    await wrapper
      .find('.container')
      .trigger('touchstart', { touches: [{ pageX: 0, pageY: 60 }] })
    await wrapper
      .find('.container')
      .trigger('touchend', { changedTouches: [{ pageX: 100, pageY: 60 }] })
    expect(wrapper.vm.dir).eq(Direction.RIGHT)
    wrapper.unmount()
  })
})

describe('test once', () => {
  const Wrapper = defineComponent({
    name: 'wrapper',
    directives: { Touchdir },
    data() {
      return {
        dir: null as Direction | null
      }
    },
    methods: {
      move(dir: Direction) {
        this.dir = dir
      }
    },
    template: `
      <div class="container" style="width: 100px; height: 100px" v-touchdir.once="move"></div>
    `
  })

  test('test touch trigger once', async () => {
    const wrapper = mount(Wrapper, { attachTo: document.body })
    await wrapper
      .find('.container')
      .trigger('touchstart', { touches: [{ pageX: 0, pageY: 60 }] })
    await wrapper
      .find('.container')
      .trigger('touchend', { changedTouches: [{ pageX: 100, pageY: 60 }] })
    expect(wrapper.vm.dir).eq(Direction.RIGHT)

    await wrapper
      .find('.container')
      .trigger('touchstart', { touches: [{ pageX: 100, pageY: 60 }] })
    await wrapper
      .find('.container')
      .trigger('touchend', { changedTouches: [{ pageX: 0, pageY: 60 }] })

    expect(wrapper.vm.dir).eq(Direction.RIGHT)

    wrapper.unmount()
  })
})

describe('test self', () => {
  const Wrapper = defineComponent({
    name: 'wrapper',
    directives: { Touchdir },
    data() {
      return {
        dir: null as Direction | null
      }
    },
    methods: {
      move(dir: Direction) {
        this.dir = dir
      }
    },
    template: `
      <div class="container" style="width: 100px; height: 100px" v-touchdir.self="move">
        <div class="inner" style="width: 50px; height 50px;"></div>
      </div>
    `
  })

  test('test self', async () => {
    const wrapper = mount(Wrapper, { attachTo: document.body })
    await wrapper
      .find('.container')
      .trigger('touchstart', { touches: [{ pageX: 0, pageY: 60 }] })
    await wrapper
      .find('.container')
      .trigger('touchend', { changedTouches: [{ pageX: 100, pageY: 60 }] })
    expect(wrapper.vm.dir).eq(Direction.RIGHT)

    await wrapper
      .find('.container')
      .trigger('touchstart', { touches: [{ pageX: 0, pageY: 0 }] })
    await wrapper
      .find('.container')
      .trigger('touchend', { changedTouches: [{ pageX: 100, pageY: 0 }] })
    expect(wrapper.vm.dir).eq(Direction.RIGHT)
    wrapper.unmount()
  })
})

describe('test stop', () => {
  const option = {
    name: 'wrapper',
    directives: { Touchdir },
    data() {
      return {
        outDir: null as Direction | null,
        inDir: null as Direction | null
      }
    },
    methods: {
      outHandle(dir: Direction) {
        this.outDir = dir
      },
      inHandle(dir: Direction) {
        this.inDir = dir
      }
    }
  }

  test('test normal', async () => {
    const Wrapper = defineComponent({
      ...option,
      template: `
      <div class="container" style="width: 100px; height: 100px" v-touchdir="outHandle">
        <div class="inner" style="width: 50px; height 50px;" v-touchdir="inHandle"></div>
      </div>
    `
    })

    const wrapper = mount(Wrapper, { attachTo: document.body })

    await wrapper
      .find('.inner')
      .trigger('touchstart', { touches: [{ pageX: 0, pageY: 0 }] })
    await wrapper
      .find('.inner')
      .trigger('touchend', { changedTouches: [{ pageX: 100, pageY: 0 }] })
    expect(wrapper.vm.inDir).eq(Direction.RIGHT)
    expect(wrapper.vm.outDir).eq(Direction.RIGHT)

    wrapper.unmount()
  })

  test('test stop', async () => {
    const Wrapper = defineComponent({
      ...option,
      template: `
      <div class="container" style="width: 100px; height: 100px" v-touchdir="outHandle">
        <div class="inner" style="width: 50px; height 50px;" v-touchdir.stop="inHandle"></div>
      </div>
    `
    })

    const wrapper = mount(Wrapper, { attachTo: document.body })

    await wrapper
      .find('.inner')
      .trigger('touchstart', { touches: [{ pageX: 0, pageY: 0 }] })
    await wrapper
      .find('.inner')
      .trigger('touchend', { changedTouches: [{ pageX: 100, pageY: 0 }] })
    expect(wrapper.vm.inDir).eq(Direction.RIGHT)
    expect(wrapper.vm.outDir).eq(null)

    wrapper.unmount()
  })
})
