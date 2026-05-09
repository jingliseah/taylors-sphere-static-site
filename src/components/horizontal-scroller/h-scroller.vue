<template>
    <div class="h-scroller" ref="hScroller">
        <div class="fixed-content-container">
            <div class="ts-component">
                <p class="ts-component-title heading-s text-uppercase t-red">Taylor’sphere Components</p>
                <h2 class="display-xxl text-uppercase pb-4">
                    Tayl<span class="t-red">o</span>r's <br>
                    <span v-html="content"></span>
                </h2>
                <p class="explore-more fs-4" @click.prevent="$emit('card-click', cardIndex)">EXPLORE MORE ></p>
            </div>
        </div>
        
        <div class="h-scroll-wrapper" ref="hScrollWrap">
            <template v-for="(item, index) in tComponentsData">
                <div class="slide" :key="item.id + '-1'" @click.prevent="$emit('card-click', index)">
                    <div class="card card-picture-frame">
                        <div class="card-img ratio ratio-16x9">
                            <img :src="item.image" alt="Image">
                        </div>
                    </div>
                </div>
                <!-- <HScrollSlide v-if="index !== tComponentsData.length - 1" v-slot="{ isIntersecting }" @intersecting="changeContent(item)" :key="item.id + '-2'"> -->
                <HScrollSlide v-slot="{ isIntersecting }" @intersecting="changeContent(item, index)" :key="item.id + '-2'">
                    <!-- <p :class="{ 'bg-primary': isIntersecting }">is intersecting: {{ isIntersecting }}</p> -->
                </HScrollSlide>
            </template>
        </div>

        <div class="center-marker"></div>

        <progress class="progress-bar" ref="progressBar" max="100" value="0"></progress>
    </div>
</template>

<script>
import { gsap, ScrollTrigger } from 'gsap/all';
import HScrollSlide from './h-scroll-slide.vue';

import tComponentsData from '@/mocks/t-components';

const mql = window.matchMedia("(min-width: 768px)");
export default {
    props: {
        id: String
    },
    components: {
        HScrollSlide
    },
    data () {
        return {
            scrollContentWidth: 0,
            content: tComponentsData[0].content,
            images: [],
            cardIndex: 0,
            tComponentsData
        }
    },
    mounted () {
        
        setTimeout(() => {
            let pinWrap = this.$el.querySelector(".h-scroll-wrapper");
            let pinWrapWidth = pinWrap.offsetWidth;
            let horizontalScrollLength = pinWrapWidth - window.innerWidth;

            const timeline = gsap.timeline({
                scrollTrigger: {
                    scroller: '.smooth-scroll', //locomotive-scroll
                    scrub: true,
                    trigger: this.$refs.hScroller,
                    pin: true,
                    end: () => pinWrapWidth * 1.5,
                    invalidateOnRefresh: true,
                }
            });

            timeline
                .to(pinWrap, {
                    x: -(horizontalScrollLength),
                    ease: "none"
                })
                .to(this.$refs.progressBar, {
                    value: 100,
                    ease: 'none'
                }, '<')
                
            ScrollTrigger.refresh()
            this.scrollContentWidth = horizontalScrollLength;

            this.$emit('ready', horizontalScrollLength)
        }, 500)
    },
    methods: {
        changeContent (component, i) {
            this.content = component.content;
            this.cardIndex = i
        }
    }
}
</script>

<style lang="scss">
    .explore-more {
        cursor: pointer;
        font-weight: 900;
        color: $taylors-red;
        transition: all .3s ease;

        &:hover {
            color: black;
        }
    }
    
    .h-scroller {
        height: 100vh;
        overflow: hidden;
        display: flex;
        left: 0;
        position: relative;
    }

    .h-scroll-wrapper {
        height: 100vh;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 50px 0;
        pointer-events: none;

        & > * {
            min-width: 130vw;
            padding: 0 5vw;
        }

        .slide {
            pointer-events: auto;
            // border: 1px solid red;

            .card {
                cursor: pointer;
            }
        }

        @include media-breakpoint-up (md) {
            & > * {
                min-width: 60vw;
                padding: 0 5vw;
            }
        }
    }

    .center-marker {
        position: absolute;
        width: 2px;
        height: 100vh;
        // background: tomato;
        top: 0;
        left: calc(50vw - 1px);
    }

    .progress-bar {
        height: 10px;
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
        background: transparent;

        &::-webkit-progress-bar {
            background: transparent;
        }

        &::-webkit-progress-value {
            background: $taylors-red;
            background-attachment: fixed;
        }

        &::-moz-progress-bar {
            background: $taylors-red;
            background-attachment: fixed;
        }

    }

    .fixed-content-container {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    // .ts-component-title {
    //     position: absolute;
    //     top: 6rem;
    //     left: 50%;
    //     transform: translateX(-50%);
    // }
</style>