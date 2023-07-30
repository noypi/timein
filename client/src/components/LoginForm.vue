<template>
    <div class="grid gap-3 grid-cols-1">
        <div class="">
            <q-input color="teal"
                     filled
                     v-model="vusername"
                     @change="emit('update:username', $event)"
                     label="Username">

                <template v-slot:append>
                    <q-icon name="person" />
                </template>
            </q-input>
        </div>
        <div class="">
            <q-input color="teal"
                     filled
                     v-model="vpassword"
                     @change="emit('update:password', $event)"
                     :type="is_password ? 'password' : 'text'"
                     label="Password">
                <template v-slot:append>
                    <q-icon :name="is_password ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer"
                            @click="is_password = !is_password" />
                </template>
            </q-input>
        </div>
        <div class="flex flex-row space-x-2 mt-4">
            <div>
                <q-btn class="glossy"
                       color="grey"
                       label="Create Account" />
            </div>
            <div>
                <q-btn class="glossy"
                       color="teal"
                       label="Login" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import type { UserLoginType } from 'types/models'

const props = defineProps<UserLoginType>()

const emit = defineEmits<{
    'update:username': [value: string],
    'update:password': [value: string],
    LoginEvent: [value: UserLoginType]
}>()

const vusername = ref(props.username)
const vpassword = ref(props.password)
const is_password = ref(true)

</script>

