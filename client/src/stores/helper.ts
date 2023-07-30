import { inject } from 'vue';

export const state_key = Symbol()

export const get_state = () => inject(state_key)
