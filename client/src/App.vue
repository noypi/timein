<template>
    <router-view />
</template>

<script setup lang="ts">

import { provide } from 'vue';
import './index.css'

import { useLayoutStore } from './stores/layout';
import { state_key } from './stores/helper'

const state = {};
Object.defineProperties(state, {
    layout: {
        value: useLayoutStore(),
        writable: false
    }
})

provide(state_key, state)

</script>
