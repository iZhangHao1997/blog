---
title: sass
btnText: increase
---

123123

{{ 1+ 1}}

<span v-for="x in 5">{{x}}</span>

<script setup>
import { ref } from 'vue'
import {useData} from "vitepress"

const count = ref(0)
const metaData = useData()
</script>

## Markdown Content

The count is: {{ count }}

<button :class="$style.button" @click="count++">{{$frontmatter.btnText}}</button>

<pre>{{metaData.page}}</pre>

<style module>
.button {
  color: red;
  font-weight: bold;
  border: 1px solid grey;
}
</style>

<!--@include: at-rules.md -->
