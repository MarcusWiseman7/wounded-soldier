<template>
    <div class="tiptap">
        <div class="menu" v-if="editor">
            <button
                v-for="(b, i) in menuButtons"
                :key="i"
                @click="menuBtn(b)"
                :class="{ 'is-active': editor.isActive(b.id) }"
            >
                <component :is="b.icon"></component>
            </button>
        </div>
        <editor-content :editor="editor"></editor-content>
    </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2';
import StarterKit from '@tiptap/starter-kit';

import Bold from '@/assets/icons/editor/bold.svg?inline';
import Italic from '@/assets/icons/editor/italic.svg?inline';
import BulletList from '@/assets/icons/editor/bullet_list.svg?inline';
import NumberList from '@/assets/icons/editor/number_list.svg?inline';
import Strikethru from '@/assets/icons/editor/strikethru.svg?inline';
import Underline from '@/assets/icons/editor/underline.svg?inline';
import H1 from '@/assets/icons/editor/h1.svg?inline';
import H2 from '@/assets/icons/editor/h2.svg?inline';
import H3 from '@/assets/icons/editor/h3.svg?inline';
import Paragragh from '@/assets/icons/editor/paragragh.svg?inline';

export default {
    name: 'TipTap',
    components: { EditorContent, Bold, Italic, Underline, Strikethru, NumberList, BulletList, H1, H2, H3, Paragragh },
    props: {
        value: { type: String, default: '' },
    },
    data() {
        return {
            editor: null,
            menuButtons: [
                { icon: 'H1', id: ('heading', { level: 1 }) },
                { icon: 'H2', id: `'heading', { level: 2 }` },
                { icon: 'H3', id: `'heading', { level: 3 }` },
                { icon: 'Paragragh', id: 'paragragh' },
                { icon: 'Bold', id: 'bold' },
                { icon: 'Italic', id: 'italic' },
                { icon: 'Underline', id: 'underline' },
                { icon: 'Strikethru', id: 'strike' },
                { icon: 'BulletList', id: 'bulleted' },
                { icon: 'NumberList', id: 'numbered' },
            ],
        };
    },
    watch: {
        value(v) {
            const isSame = this.editor.getHTML() === v;
            if (isSame) return;

            this.editor.commands.setContent(v, false);
        },
    },
    methods: {
        menuBtn(b) {
            switch (b.id) {
                case ('heading', { level: 1 }):
                    this.editor
                        .chain()
                        .focus()
                        .toggleHeading({ level: 1 })
                        .run();
                    break;
                case `'heading', { level: 2 }`:
                    this.editor
                        .chain()
                        .focus()
                        .toggleHeading({ level: 2 })
                        .run();
                    break;
                case `'heading', { level: 3 }`:
                    this.editor
                        .chain()
                        .focus()
                        .toggleHeading({ level: 3 })
                        .run();
                    break;
                case 'bold':
                    this.editor
                        .chain()
                        .focus()
                        .toggleBold()
                        .run();
                    break;
                case 'italic':
                    this.editor
                        .chain()
                        .focus()
                        .toggleItalic()
                        .run();
                    break;
                case 'underline':
                    break;
                case 'strike':
                    this.editor
                        .chain()
                        .focus()
                        .toggleStrike()
                        .run();
                    break;
            }
        },
    },
    mounted() {
        this.editor = new Editor({
            extensions: [StarterKit],
            content: this.value,
            onUpdate: () => {
                this.$emit('update-content', this.editor.getHTML());
            },
        });
    },
    beforeDestroy() {
        this.editor.destroy();
    },
};
</script>

<style lang="scss" scoped>
.tiptap {
    padding: 40px;
}

.menu {
    background: var(--color-bg-second);
    margin: 0 0 20px 0;
    padding: 10px;
    display: flex;
    gap: 6px;

    button {
        padding: 4px 8px 2px;
        border-radius: 4px;
        background: var(--color-bg-third);
    }
}

.is-active {
    svg {
        fill: var(--color-main);
    }
}
</style>
