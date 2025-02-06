<template>
    <span class="has-text-danger">
        <div class="icon-text py-1">
            <span class="icon has-text-danger">
                <i class="fas fa-ban"></i>
            </span>
            <span>{{ err_text }}</span>
        </div>
    </span>
</template>
<script>
export default {
    name: 'DisplayError',
    props: {
        err_text: {
            type: String,
            required: true
        },
    }
}
</script>
<style scoped></style>