<template>
    <div class="slide">
        <slot v-bind:isIntersecting="isIntersecting"></slot>
    </div>
</template>

<script>
export default {
    data () {
        return {
            isIntersecting: false
        }
    },
    mounted () {
        const io = new IntersectionObserver(
            this.handleIOChanges,
            {
                threshold: 0.5
            }
        )
        io.observe(this.$el)
    },
    methods: {
        handleIOChanges (entries) {
            for (let entry of entries) {
                if (entry.intersectionRatio > 0.5) {
                    this.isIntersecting = true;
                    this.$emit('intersecting');
                } else {
                    this.isIntersecting = false
                }
            }
        }
    }
}
</script>

<style>

</style>