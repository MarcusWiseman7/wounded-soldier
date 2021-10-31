<template>
    <div class="compose">
        <client-only>
            <tip-tap :value="content" @update-content="content = $event"></tip-tap>

            <div class="content">
                <h3>Content in HTML</h3>
                <pre><code>{{ content }}</code></pre>
            </div>
        </client-only>
    </div>
</template>

<script>
export default {
    name: 'ComposeArticle',
    data() {
        return {
            content: `<p>I'm running TipTap with Nuxtjs</p>`,
        };
    },
};
</script>

<style lang="scss" scoped>
.compose {
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
