<template>
    <div class="compose">
        <div class="compose__editor">
            <div class="compose__input">
                <div class="title">Title</div>
                <div class="input-wrapper">
                    <input type="text" v-model="title" />
                </div>
            </div>

            <div class="compose__input">
                <div class="title">Intro</div>
                <div class="input-wrapper">
                    <input type="text" v-model="intro" />
                </div>
            </div>

            <div class="compose__input">
                <div class="title">Image</div>
                <input type="file" name="" id="" />
            </div>

            <div class="compose__input">
                <div class="title">Body</div>
                <div class="input-wrapper">
                    <client-only>
                        <tip-tap :value="content" @update-content="content = $event"></tip-tap>

                        <div class="content">
                            <h3>Content in HTML</h3>
                            <pre><code>{{ content }}</code></pre>
                        </div>
                    </client-only>
                </div>
            </div>
        </div>
        <div class="compose__preview">
            <div class="title">{{ title }}</div>
            <div class="intro">{{ intro }}</div>
            <div class="body" v-html="content"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ComposeArticle',
    layout: 'admin',
    data() {
        return {
            content: `<blockquote><p>I'm running TipTap with Nuxtjs</p></blockquote>`,
            title: '',
            intro: '',
        };
    },
};
</script>

<style lang="scss" scoped>
.compose {
    display: flex;
    gap: 20px;
    padding: 20px;

    &__editor {
        width: calc(50% - 10px);
        background: var(--color-bg-third);
        padding: 20px;
    }

    &__preview {
        width: calc(50% - 10px);
        background: var(--color-bg-third);
        padding: 20px;

        .title {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 20px;
        }

        .intro {
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 16px;
        }

        .body {
            font-size: 16px;
            font-weight: 500;

            /deep/ ol,
            /deep/ ul {
                padding: 0 1rem;
            }

            /deep/ ul {
                list-style-type: disc !important;
            }

            /deep/ img {
                max-width: 100%;
                height: auto;
            }

            /deep/ blockquote {
                margin-left: 2rem;
                padding-left: 1rem;
                border-left: 2px solid var(--color-hover);
            }

            /deep/ hr {
                border: none;
                border-top: 2px solid var(--color-hover);
                margin: 2rem 0;
            }

            /deep/ p:empty {
                height: 20px;
            }
        }
    }

    &__input {
        margin-bottom: 20px;

        .title {
            padding: 4px 10px;
            border-radius: 4px 4px 0 0;
            width: fit-content;
            background: var(--color-bg-second);
            margin-bottom: 4px;
        }

        .input-wrapper {
            box-shadow: 0 0 4px 4px var(--color-shadow);
            padding-left: 10px;
        }

        input {
            width: 100%;
            height: 100%;
            font-size: 18px;
        }
    }
}

/* Basic editor styles */
.ProseMirror {
    > * + * {
        margin-top: 0.75em;
    }

    code {
        // background-color: rgba(#616161, 0.1);
        // color: #616161;
    }
}

.content {
    padding: 1rem 0 0;

    h3 {
        margin: 1rem 0 0.5rem;
    }

    pre {
        border-radius: 4px;
        color: #333;
    }

    code {
        display: block;
        white-space: pre-wrap;
        font-size: 0.8rem;
        padding: 0.75rem 1rem;
        background-color: var(--color-bg-third);
        color: var(--color-text);
    }
}
</style>
