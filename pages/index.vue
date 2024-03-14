<script setup lang="ts">
import { ref ,computed } from 'vue';
const emojis = ['😌' ,'😣', '😞', '😊', '😆', '😀'];
const ranks = [1 ,2, 3, 4, 5];


const rank = ref<number>(0)
const emojiWrapper = ref<HTMLDivElement>()

const emojiScrollTop = computed(() => { 
  return {
    // transform: `translate(0, -${(rank.value - 1) * 100}%)`
    marginTop: `-${rank.value * 100}%`
  }
})

function onChange (): void{
  if(emojiWrapper.value) {
    emojiWrapper.value.scrollTo({
      top: rank.value * emojiWrapper.value.clientHeight,
      behavior: 'smooth'
    })
  }
}
</script>
<template>
  <div id="app">
    <div 
      class="emoji-wrapper row-span-2 overflow-hidden p-1"
      ref="emojiWrapper"
    >
      <div
        class="emoji w-18 h-18 flex justify-center items-center text-7xl mb-2 snyp-y"
        v-for="(emoji, index) in emojis"
        :key="index"
      >
        <span>{{ emoji }}</span>
      </div>
    </div>
    <div class="text-center">{{ rank }}</div>
    <div class="rating flex-row-reverse justify-center items-center"
      @change="onChange"
    >
      <input
        type="radio"
        name="rating-2"
        class="mask mask-star-2 w-10 h-10"
        v-for="item in 5"
        :key="item"
        :class="{ 'active' : item === 6 - rank }"
        v-model="rank"
        :value="(6 - item)"
      />
    </div>
    <div class="col-span-2 text-center">{{ emojiScrollTop }} </div>
  </div>
</template>