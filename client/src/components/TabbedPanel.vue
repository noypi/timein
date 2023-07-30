<template>
    <div class="q-pa-md">
        <div class="q-gutter-y-md"
             style="max-width: 600px">
            <q-card>
                <q-tabs v-model="tab"
                        @update:model-value="emit('update:active_tab', $event)"
                        dense
                        class="bg-grey-2 text-grey-7"
                        active-color="primary"
                        indicator-color="purple"
                        align="justify">
                    <q-tab v-for="(item, index) in items"
                           :key="index"
                           :name="item.name"
                           :label="item.label" />
                </q-tabs>

                <q-tab-panels v-model="tab"
                              animated
                              class="text-white">
                    <q-tab-panel v-for="(tab, index) in items"
                                 :name="tab.name"
                                 :key="index">
                        <slot :name="tab.name"></slot>
                    </q-tab-panel>
                </q-tab-panels>

            </q-card>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref } from 'vue'

interface TabHeaderType {
    name: string;
    label: string;
}

const props = defineProps<{
    items: TabHeaderType[],
}>()

const emit = defineEmits<{
    'update:active_tab': [value: string]
}>()

const tab = ref(props.items.at(0)?.name ?? '')

</script>
