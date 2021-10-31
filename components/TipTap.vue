<template>
    <div class="tiptap">
        <div class="menu" v-if="editor">
            <button
                v-for="(b, i) in menuButtons"
                :key="i"
                @click="editorMethods[b.id](b)"
                :class="{
                    'is-active': b.level
                        ? editor.isActive('heading', { level: b.level })
                        : b.align
                        ? editor.isActive({ textAlign: b.align })
                        : b.color
                        ? false
                        : editor.isActive(b.id),
                    spacer: b.spacer,
                }"
            >
                <component
                    v-if="b.icon && b.id"
                    :is="b.icon"
                    :style="{
                        fill:
                            b.id === 'highlight' && editor.isActive('highlight')
                                ? editor.getAttributes('highlight').color
                                : b.id === 'textStyle' && editor.isActive('textStyle')
                                ? editor.getAttributes('textStyle').color
                                : '',
                    }"
                ></component>
            </button>
        </div>
        <editor-content :editor="editor"></editor-content>
    </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
// import Link from '@tiptap/extension-link';

import H1 from '@/assets/icons/editor/h1.svg?inline';
import H2 from '@/assets/icons/editor/h2.svg?inline';
import H3 from '@/assets/icons/editor/h3.svg?inline';
import Paragraph from '@/assets/icons/editor/paragraph.svg?inline';
import TextColor from '@/assets/icons/editor/text_color.svg?inline';
import Hlight from '@/assets/icons/editor/highlight.svg?inline';
import Bold from '@/assets/icons/editor/bold.svg?inline';
import Italic from '@/assets/icons/editor/italic.svg?inline';
import Uline from '@/assets/icons/editor/underline.svg?inline';
import Strikethru from '@/assets/icons/editor/strikethru.svg?inline';
import BulletList from '@/assets/icons/editor/bullet_list.svg?inline';
import NumberList from '@/assets/icons/editor/number_list.svg?inline';
import Quote from '@/assets/icons/editor/quote.svg?inline';
import Rule from '@/assets/icons/editor/horizontal_rule.svg?inline';
import Left from '@/assets/icons/editor/left.svg?inline';
import Center from '@/assets/icons/editor/center.svg?inline';
import Justify from '@/assets/icons/editor/justify.svg?inline';
import Right from '@/assets/icons/editor/right.svg?inline';

export default {
    name: 'TipTap',
    components: {
        EditorContent,
        H1,
        H2,
        H3,
        Paragraph,
        TextColor,
        Hlight,
        Bold,
        Italic,
        Uline,
        Strikethru,
        BulletList,
        NumberList,
        Quote,
        Rule,
        Left,
        Center,
        Justify,
        Right,
    },
    props: {
        value: { type: String, default: '' },
    },
    data() {
        return {
            editor: null,
            textColor: 'pink',
            highlightColor: '#8ce99a',
        };
    },
    watch: {
        value(v) {
            const isSame = this.editor.getHTML() === v;
            if (isSame) return;

            this.editor.commands.setContent(v, false);
        },
    },
    computed: {
        menuButtons() {
            return [
                { icon: 'H1', id: 'heading', level: 1 },
                { icon: 'H2', id: 'heading', level: 2 },
                { icon: 'H3', id: 'heading', level: 3 },
                { icon: 'Paragraph', id: 'paragraph', spacer: true },
                { icon: 'TextColor', id: 'textStyle', color: this.textColor },
                { icon: 'Hlight', id: 'highlight', color: this.highlightColor, spacer: true },
                { icon: 'Bold', id: 'bold' },
                { icon: 'Italic', id: 'italic' },
                { icon: 'Uline', id: 'underline' },
                { icon: 'Strikethru', id: 'strike', spacer: true },
                { icon: 'BulletList', id: 'bulletList' },
                { icon: 'NumberList', id: 'orderedList' },
                { icon: 'Quote', id: 'blockquote' },
                { icon: 'Rule', id: 'seperator', spacer: true },
                { icon: 'Left', id: 'align', align: 'left' },
                { icon: 'Center', id: 'align', align: 'center' },
                { icon: 'Justify', id: 'align', align: 'justify' },
                { icon: 'Right', id: 'align', align: 'right' },
            ];
        },
        editorMethods() {
            return {
                heading: b =>
                    this.editor
                        .chain()
                        .focus()
                        .toggleHeading({ level: b.level })
                        .run(),
                paragraph: b =>
                    this.editor
                        .chain()
                        .focus()
                        .setParagraph()
                        .run(),
                textStyle: b =>
                    this.editor
                        .chain()
                        .focus()
                        .setColor(b.color)
                        .run(),
                highlight: b =>
                    this.editor
                        .chain()
                        .focus()
                        .toggleHighlight({ color: b.color })
                        .run(),
                bold: b =>
                    this.editor
                        .chain()
                        .focus()
                        .toggleBold()
                        .run(),
                italic: b =>
                    this.editor
                        .chain()
                        .focus()
                        .toggleItalic()
                        .run(),
                underline: b =>
                    this.editor
                        .chain()
                        .focus()
                        .toggleUnderline()
                        .run(),
                strike: b =>
                    this.editor
                        .chain()
                        .focus()
                        .toggleStrike()
                        .run(),
                bulletList: b =>
                    this.editor
                        .chain()
                        .focus()
                        .toggleBulletList()
                        .run(),
                orderedList: b =>
                    this.editor
                        .chain()
                        .focus()
                        .toggleOrderedList()
                        .run(),
                blockquote: b =>
                    this.editor
                        .chain()
                        .focus()
                        .toggleBlockquote()
                        .run(),
                seperator: b =>
                    this.editor
                        .chain()
                        .focus()
                        .setHorizontalRule()
                        .run(),
                align: b =>
                    this.editor
                        .chain()
                        .focus()
                        .setTextAlign(b.align)
                        .run(),
            };
        },
    },
    mounted() {
        this.editor = new Editor({
            extensions: [
                StarterKit,
                TextAlign.configure({
                    types: ['heading', 'paragraph'],
                    alignments: ['left', 'center', 'justify', 'right'],
                }),
                Highlight.configure({
                    multicolor: true,
                }),
                Underline,
                TextStyle,
                Color.configure({
                    types: ['textStyle'],
                }),
                // Link,
            ],
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

/deep/ .ProseMirror {
    ol,
    ul {
        padding: 0 1rem;
    }

    ul {
        list-style-type: disc !important;
    }

    img {
        max-width: 100%;
        height: auto;
    }

    blockquote {
        margin-left: 2rem;
        padding-left: 1rem;
        border-left: 2px solid var(--color-hover);
    }

    hr {
        border: none;
        border-top: 2px solid var(--color-hover);
        margin: 2rem 0;
    }
}

.menu {
    background: var(--color-bg-second);
    margin: 0 0 20px 0;
    padding: 10px;
    display: flex;
    gap: 6px;
    width: fit-content;
    border-radius: 4px;

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

.spacer {
    margin-right: 8px;
}
</style>
