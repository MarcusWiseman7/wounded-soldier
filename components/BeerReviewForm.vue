<template>
    <div class="review">
        <div class="rating-row">
            <label v-if="!actImage" for="upload-pic" class="upload" :class="{ 'upload--error': uploadError }">
                <img src="@/assets/icons/camera.svg" alt="Image" />
                <p>Upload beer pic</p>
            </label>
            <img v-else class="upload" :src="actImage" alt="upload" />
            <p v-if="uploadError" class="error">Error in upload, please try again</p>
        </div>

        <div v-for="q in questions" :key="q.id" class="rating-row">
            <div class="rating-row__label">
                <label for="overall">{{ q.label }}</label>
                <p class="rating-row__number">({{ newRating[q.id] }})</p>
            </div>
            <div class="rating-row__hint-row" :class="{ 'rating-row__hint-row--active': activeHint == q.id }">
                <p class="rating-row__hint">{{ q.lside }}</p>
                <p class="rating-row__hint">{{ q.rside }}</p>
            </div>
            <div @mouseenter="activeHint = q.id" @mouseleave="activeHint = null">
                <b-rating
                    :id="q.id"
                    :reviewing="true"
                    :key="'rating-' + q.id"
                    @my-rating="
                        newRating[q.id] = $event;
                        setHint(q.id);
                    "
                    @clicked="selectQ(q.id)"
                ></b-rating>
            </div>
        </div>

        <div class="rating-row">
            <b-input type="textarea" label="Tasting notes" class="notes">
                <textarea
                    v-model="newRating.notes"
                    name="tasting_notes"
                    id="tasting_notes"
                    rows="4"
                    placeholder="My review..."
                    maxlength="250"
                ></textarea>
            </b-input>
        </div>

        <b-button group="main" :disabled="!formOK" @clicked="sendReview">Send review</b-button>

        <input type="file" name="upload-pic" id="upload-pic" accept="image/*" @change="processFile" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'BeerReviewForm',
    props: {
        beer: { type: Object, default: () => null },
    },
    data() {
        return {
            newRating: { rating: 0, bitter: 0, finish: 0, notes: '' },
            questions: [
                { id: 'rating', label: 'Overall rating', lside: 'gross', rside: 'damn good' },
                { id: 'bitter', label: 'How bitter is it?', lside: 'sugar', rside: 'tree bark' },
                { id: 'finish', label: 'Finish / aftertaste?', lside: 'bad', rside: 'good' },
            ],
            activeHint: null,
            activeTimeout: null,
            selected: [],
            actImage: null,
            uploadedFile: null,
            uploadError: false,
        };
    },
    computed: {
        ...mapGetters(['myId']),
        formOK() {
            return this.selected.includes('rating');
        },
    },
    methods: {
        selectQ(id) {
            if (!this.selected.includes(id)) this.selected.push(id);
        },
        setHint(id) {
            if (!this.$device.isMobile) return;

            this.activeHint = id;
            window.clearTimeout(this.activeTimeout);
            this.activeTimeout = window.setTimeout(() => {
                this.activeHint = null;
            }, 2000);
        },
        processFile() {
            if (event.target.files.length === 1) {
                if (!event.target.files[0].type.startsWith('image/')) {
                    this.uploadError = true;
                    return;
                }
                this.uploadedFile = event.target.files[0];
                event.target.value = ''; // Allow upload of same file after cancel
                this.actImage = window.URL.createObjectURL(this.uploadedFile);
            }
        },
        async addPic() {
            // add file to cloudinary
            const formData = new FormData();
            formData.append('file', this.uploadedFile);
            formData.append('upload_preset', 'dqwdrkz4');

            const blah = this.$axios.defaults.headers.common['Authorization'];
            this.$axios.setToken(false);

            await this.$axios
                .post('https://api.cloudinary.com/v1_1/dqrpaoopz/image/upload', formData)
                .then(res => {
                    this.newRating.pic = res.data.secure_url;
                    this.newRating.picId = res.data.public_id;
                })
                .catch(err => {
                    console.warn('addPic error :>> ', err);
                })
                .finally(() => {
                    if (blah) this.$axios.setToken(blah);
                });

            return;
        },
        async sendReview() {
            if (!this.formOK) return;

            if (this.uploadedFile) {
                await this.addPic();
                if (!this.newRating.pic) return;
            }

            this.newRating.beer = this.beer._id;
            this.newRating.reviewer = this.myId;

            await this.$store.dispatch('addReview', this.newRating);

            this.$emit('close');
        },
    },
    beforeDestroy() {
        if (this.actImage) window.URL.revokeObjectURL(this.uploadedFile);
    },
};
</script>

<style lang="scss" scoped>
label {
    color: var(--color-main);
    font-weight: 700;
}

.upload {
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
    padding: 20px;
    border-radius: 4px;
    text-align: center;
    height: 85px;

    p {
        font-size: 14px;
        color: var(--color-text);
        font-weight: 400;
        margin-top: 8px;
    }

    &--error {
        box-shadow: 0 0 6px var(--color-error);
    }
}

.error {
    color: var(--color-error);
    font-size: 12px;
    margin-top: 4px;
}

.rating-row {
    display: flex;
    align-items: center;
    justify-items: center;
    flex-flow: wrap;
    flex-direction: column;
    margin-bottom: 40px;

    &__number {
        margin-left: 8px;
    }

    @include breakpoint(m) {
        label {
            font-size: 22px;
        }

        &__number {
            text-align: center;
            min-width: 30px;
            font-size: 22px;
        }
    }

    &__label {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &__hint {
        font-size: 12px;
    }

    &__hint-row {
        opacity: 0;
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 0 16px;

        &--active {
            opacity: 1;
        }
    }
}

.notes {
    width: 100%;
}
</style>
