<template>
    <q-page class="row items-center justify-evenly">
        <tabbed-panel v-model:active_tab="active_tab"
                      :items="items">
            <template #login>
                <login-form v-model:username="username"
                            v-model:password="password" />
            </template>
            <template #qrlogin>
                some item
            </template>
        </tabbed-panel>

    </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LoginForm from 'components/LoginForm.vue'
import TabbedPanel from 'components/TabbedPanel.vue'

import { get_state } from 'stores/helper';

const items = [
    { name: 'login', label: 'Login' },
    { name: 'qrlogin', label: 'QR Login' }
]

const username = ref('');
const password = ref('');

const active_tab = ref('login');

const { layout } = get_state()

onMounted(() => {
    layout.set_title('some title')
    layout.set_footer_title('some footer title')
})

</script>

