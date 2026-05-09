<template>
    <div class="carousel carousel-student ps-lg-5">
        <div class="carousel-container carousel-container-main swiper-container" ref="swiperContainerMain">
            <div class="swiper-wrapper">
                <slot name="carousel-slides-main"></slot>
            </div>
        </div>
        <div class="instruction align-items-center d-none d-md-flex">
            <p class="mb-0 me-3">SWIPE TO EXPLORE MORE</p>
            <svg v-svg symbol="sprite-chevron-right"></svg>
        </div>
    </div>
</template>

<script>
import Swiper from 'swiper';

export default {
    mounted () {
        this.$nextTick(() => this.initialise())
    },
    beforeDestroy () {
        this.$refs.swiperContainerMain?.swiper.destroy();
    },
    methods: {
        initialise () {
            const containerMain = this.$refs.swiperContainerMain;
            const swiperMain = new Swiper(containerMain, {
                slidesPerView: 1,
                loop: true,
                loopAdditionalSlides: 2,
                slideToClickedSlide: true,
                breakpoints: {
                    1200: {
                        slidesPerView: 3.8
                    }
                },
                roundLengths: true,
                grabCursor: true,
            })
        },
    }
}
</script>

<style lang="scss">
    .carousel.carousel-student {
        position: relative;
        overflow: hidden;

        .swiper-wrapper {
            align-items: flex-end;
        }

        .carousel-container {
            position: relative;
            overflow: visible;
        }

        .carousel-container-sub {
            transform: scale(0.5);
            transform-origin: middle right;
        }

        .swiper-slide {
            transform: translateX(-16rem) translateY(-7rem) scale(0.55);
            transition: 1s ease;
            transition-property: transform, transform-origin;

            .card.card-student {
                margin-top: 3rem;
            }
            
            &:nth-child(odd) {
                .card {
                    .red-element {
                        background-color: black;
                    }
                }
            }

            &-active {
                transform: none;
                z-index: 2;

                .card.card-student {
                    .red-element {
                        background-color: $taylors-red;
                    }
                }
            }
        }

        .instruction {
            font-size: 16px;
            position: absolute;
            left: 50%;
            bottom: 3rem;
            font-weight: 800;
            color: $taylors-red;
        }

        @include media-breakpoint-up (md) {
            .carousel-container-main {
                padding-bottom: 10rem;
                padding-top: 2rem;
            }

            .swiper-slide {
                transform: translateX(10rem);
                transform-origin: bottom left;

                &-active {
                    transform: scale(1.7) translateY(calc(10rem / 1.7));
                }

                &-prev {
                    transform: translateX(-10rem);
                }
            }

            .instruction {
                font-size: 18px;
            }
        }
    }
</style>