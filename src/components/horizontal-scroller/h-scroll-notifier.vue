<template>
    <div ref="placeholderEl">{{ isActive ? 'active!' : 'not active'}}</div>
</template>

<script>
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export default {
    props: {
        trigger: [String, Object],
        parentWidth: {
            type: Number,
            default: window.innerWidth
        },

        // The entire width of the wrapper that has this component
        scrollWidth: {
            type: Number
        }
    },
    data () {
        return {
            isActive: false
        }
    },
    mounted () {
        console.log(this.trigger, this.scrollWidth)
        if (!this.trigger) return;
        if (!this.scrollWidth) return;

        const el = this.$refs.placeholderEl;
        console.log('start', 'top top-=' + (this.$el.offsetLeft - window.innerWidth/2) * (this.scrollWidth / (this.scrollWidth - window.innerWidth)))
        console.log('end', '+=' + this.$el.offsetWidth * (this.scrollWidth / (this.scrollWidth - window.innerWidth)))

        const stInstance = ScrollTrigger.create({
            trigger: this.$el,
            start: () => 'top top-=' + (this.$el.offsetLeft - window.innerWidth/2) * (this.scrollWidth / (this.scrollWidth - window.innerWidth)),
            end: () => '+=' + this.$el.offsetWidth * (this.scrollWidth / (this.scrollWidth - window.innerWidth)),
            onToggle: () => {
                console.log('toggle')
            },
            onEnter: () => {
                console.log('entered')
                this.isActive = true
            },
            onLeave: () => this.isActive = false,
            toggleClass: {targets: this.$el, className: "active"}
        })

        console.log(stInstance)
    }
}
</script>

<style>

</style>