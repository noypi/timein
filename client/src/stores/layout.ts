import { defineStore } from 'pinia';

export const useLayoutStore = defineStore('layout', {
    state: () => ({
        header_title: '',
        footer_title: ''

    }),

    getters: {
    },

    actions: {
        set_title(title: string) {
            this.header_title = title;
        },

        set_footer_title(title: string) {
            this.footer_title = title;
        }
    }
});
