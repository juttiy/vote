<script setup lang="ts">
import type { voteType } from '~/types';
const route = useRoute()
const path: string = route.path
// import { ref ,computed } from 'vue';
const emojis = ['😌' ,'😣', '😞', '😊', '😆', '😀'];
const ranks = [1 ,2, 3, 4, 5];
const LOCAL_KEY = 'voted'
const time = new Date().getTime()

const rank = ref<number>(0)
const emojiWrapper = ref<HTMLDivElement>()
const message = ref<string>('')
const oldVote = ref<number>(0)
// const voteData = ref<voteType>()
// const pending = ref<any>()

  // const data= await $fetch('/api/vote?' + time, {
  const { data:voteData, pending } = await useFetch('/api/vote?', {
    query: {
      uid: path
    },
    watch: false,
    default() {
      return createNewData()
    }
  },)
  // console.log(voteData)
  // voteData.value = data
  // pending.value = pendingInner


const emojiScrollTop = computed(() => { 
  return {
    // transform: `translate(0, -${(rank.value - 1) * 100}%)`
    marginTop: `-${rank.value * 100}%`
  }
})
const totalVote = computed(() => {
  // await nextTick()
  console.log(voteData)
  console.log(voteData.value)
  // debugger
  const voteKeys = Object.keys(voteData.value)
  let total = 0
  let rankTotal = 0
  voteKeys.forEach((key, index) => {
    total += Number(voteData.value[key])
    rankTotal += Number(voteData.value[key]) * (index + 1) * 2
  })
  console.log(total, rankTotal)
  return {
    total,
    rankPer: (rankTotal / total) || 0
  }
})
onMounted(()=> {
  const voted = localStorage.getItem(LOCAL_KEY + path) || 0
  rank.value = voted as number
  oldVote.value = voted as number
  voted && onChange(void(0))
})

function onChange (event: any): void{
  if(emojiWrapper.value) {
    emojiWrapper.value.scrollTo({
      top: rank.value * emojiWrapper.value.clientHeight,
      behavior: 'smooth'
    })
  }
  event && setVote()
}

async function setVote() {
  const vote =  `r${rank.value}`
  const old = oldVote.value ? `r${oldVote.value}` : 0
  try {
    const data = await $fetch('/api/vote',{
    method: 'POST',
    body: {
      uid: path,
      vote: {
        vote,
        old
      }
    }
    
  })
  voteData.value = data
  } catch (error) {
    
  }
  localStorage.setItem(LOCAL_KEY + path, String(rank.value))
  oldVote.value = rank.value
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
    <div class="text-center">you vote: {{ rank }}</div>
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
    <div class="col-span-2 text-center">Rank:{{ totalVote.rankPer.toFixed(2) }}/10&nbsp;({{ totalVote.total }})</div>
    <div class="col-span-2 alert alert-error" v-if="message">
      <span>{{ message }}</span>
    </div>
  </div>
</template>