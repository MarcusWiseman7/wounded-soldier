<template>
    <div>
        <input type="file" accept=".jpeg,.jpg,.png,image/jpeg,image/png" @change="selectFile" />
    </div>
</template>

<script>
export default {
    name: 'BUpload',
    props: {
        folder: { type: String, required: true },
    },
    methods: {
        async selectFile(e) {
            const file = e.target.files[0];

            /* Make sure file exists */
            if (!file) return;

            /* create a reader */
            const readData = f =>
                new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(f);
                });

            /* Read data */
            const data = await readData(file);

            /* upload the converted data */
            const instance = this.$cloudinary.upload(data, {
                folder: this.folder,
                uploadPreset: 'your-upload-preset',
            });
        },
    },
};
</script>

<style lang="scss" scoped></style>
