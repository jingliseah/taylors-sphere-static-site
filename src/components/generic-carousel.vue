<template>
    <div class="carousel carousel-generic">
        <div class="carousel-container swiper-container" ref="swiperContainer">
            <div class="swiper-wrapper">
                <slot name="carousel-slides"></slot>
            </div>
        </div>
        <div class="carousel-controls" v-if="hasNavigation">
            <button class="swiper-button-prev" ref="btnPrev">
                <svg v-svg symbol="sprite-chevron-left"></svg>
            </button>
            <button class="swiper-button-next" ref="btnNext">
                <svg v-svg symbol="sprite-chevron-right"></svg>
            </button>
        </div>
    </div>
</template>

<script>
import Swiper from 'swiper';
import gsap from 'gsap';

export default {
    props: {
        slidesPerView: {
            type: Number,
            default: 1
        },
        slidesPerViewMd: {
            type: Number,
            default: 2
        },
        spaceBetween: {
            type: Number,
            default: 0
        },
        hasNavigation: {
            type: Boolean,
            default: true
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.initialise()
            
            setTimeout(() => {
                this.createAnimations()
            }, 1000)
        })
    },
    beforeDestroy () {
        this.$refs.swiperContainer.swiper.destroy();
    },
    methods: {
        initialise () {
            const container = this.$refs.swiperContainer;
            let swiperConfig = {
                slidesPerView: this.slidesPerView,
                spaceBetween: this.spaceBetween,
                breakpoints: {
                    768: {
                        slidesPerView: this.slidesPerViewMd
                    }
                }
            }

            if (this.hasNavigation) {
                swiperConfig.navigation = {
                    nextEl: this.$refs.btnNext,
                    prevEl: this.$refs.btnPrev
                }
            }

            new Swiper(container, swiperConfig)
        },
        createAnimations () {
            const timeline = gsap.timeline({
                scrollTrigger: {
                    scroller: '.smooth-scroll',
                    trigger: this.$el,
                    toggleActions: 'restart'
                }
            })

            const elements = Array.from(this.$el.querySelectorAll('.card'));
            
            timeline
                .from(elements, {
                    y: 100,
                    autoAlpha: 0,
                    stagger: 0.1,
                    duration: 0.6,
                })
                .to(elements, {
                    y: 0,
                    autoAlpha: 1,
                })
        }
    }
}
</script>

<style lang="scss">
    .carousel.carousel-generic {
        position: relative;

        .swiper-button-prev {
            left: -2rem;

            .icon {
                transform: rotate(180deg) scale(0.7);
            }
        }

        .swiper-button-next {
            right: -2rem;

            .icon {
                transform: scale(0.7);
            }
        }

        .swiper-button-prev,
        .swiper-button-next {
            background: white;
            border: 0;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            top: 60%;
            z-index: 1;
            transition: .3s ease;

            &::after,
            &::before {
                display: none;
            }

            .icon {
                color: #000;
            }
            
            @include media-breakpoint-up(md) {  
                width: 48px;
                height: 48px;
                top: 40%;
            }
        }

        @include media-breakpoint-up (md) {
            .swiper-button-prev {
                left: -4rem;

                .icon {
                    transform: rotate(180deg) scale(1);
                }
            }

            .swiper-button-next {
                right: -4rem;

                .icon {
                    transform: scale(1);
                }
            }
        }
    }
</style>