<template>
    <q-layout view="hHh lpR fFf">
        <q-header elevated
                  class="bg-primary text-white">
            <q-toolbar>
                <q-toolbar-title>
                    <q-avatar>
                        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
                    </q-avatar>
                </q-toolbar-title>
            </q-toolbar>

            {{ layout.header_title }}
        </q-header>

        <q-page-container>
            <router-view />
        </q-page-container>

        <q-footer elevated
                  class="bg-grey-8 text-white">
            <q-toolbar>
                <q-toolbar-title>
                    <q-avatar>
                        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
                    </q-avatar>
                    {{ layout.footer_title }}
                </q-toolbar-title>
            </q-toolbar>
        </q-footer>
    </q-layout>
</template>

<script setup lang="ts">

import { get_state } from 'stores/helper';

const { layout } = get_state()

</script>

