<template>
    <div class="student-testimonial-slider" ref="swiperContainerMain">
        <div class="student-testimonial-slider__wrp swiper-wrapper">
            <slot name="carousel-slides-main"></slot>

            <a href="#" class="student-testimonial-slider__button d-flex align-items-center" @click.prevent="$emit('read-more', slideIndex)">
                <span>READ MORE</span>
                <div class="arrow-mask">
                    <div class="arrow-wrp">
                        <img src="~@/assets/img/icons/right-arrow.svg" alt="arrow">
                        <img src="~@/assets/img/icons/right-arrow.svg" alt="arrow">
                    </div>
                </div>
            </a>
            <div class="student-testimonial-slider__pagination"></div>
            <div class="student-testimonial-slider__navigation">
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
            </div>
        </div>
        <div ref="recElement" class="student-testimonial-slider__rec-element d-none d-md-block"></div>
    </div>
</template>

<script>
import Swiper from 'swiper';

export default {
    data () {
        return {
            slideIndex: 0,
        }
    },
    mounted () {
        this.$nextTick(() => this.initialise())
    },
    beforeDestroy () {
        this.$refs.swiperContainerMain?.swiper.destroy();
    },
    methods: {
        initialise () {
            const _this = this
            const containerMain = this.$refs.swiperContainerMain;
            const recElement = this.$refs.recElement; 
            
            const swiperMain = new Swiper(containerMain, {
                spaceBetween: 30,
                effect: 'fade',
                loop: true,
                pagination: {
                    el: '.student-testimonial-slider__pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                on : {
                    init(){
                        let content = document.querySelector('.student-testimonial-slider__content');
                        let width = content.offsetWidth; 
                        document.getElementsByClassName("student-testimonial-slider__pagination")[0].style.width = (width+5) + "px"
                    },
                    slideChange(swiper) { 
                        _this.slideIndex = this.realIndex

                        if (this.activeIndex % 2 === 0) {
                            recElement.classList.remove('top')
                            recElement.classList.add('bottom')
                        } else {
                            recElement.classList.remove('bottom')
                            recElement.classList.add('top')
                        }
                    }
                }
            })
        },
    }
}
</script>

<style lang="scss">
    .student-testimonial-slider{
        position: relative;
        width   : 100%;
        margin  : 0 auto;
        padding : 20px;

        @include media-breakpoint-up(md) { 
            width  : 80%;
            padding: 30px;
        }

        .swiper-wrapper {
            border      : 1px solid $gray-400;
            border-left : 0;
            border-right: 0;

            @include media-breakpoint-up(md) { 
                border         : 0;
            }
        }

        &__rec-element {
            position: absolute;
            background: $taylors-red;
            height: 150px;
            width: 150px;
            left: 0;
            top: 0;
            border-radius: 5px;
            transition: all .4s ease-in-out;
            transform: rotate(0);

            &.bottom {
                top: calc(100% - 150px);
                transform: rotate(180deg);
                background: black;
            }

            &.top {
                top: 0;
                transform: rotate(0deg);
                background: $taylors-red;
            }
        }

        &__item {
            display     : flex;
            align-items : start;

            &.swiper-slide-prev {
                img {
                    transition-delay: .3s;
                    opacity         : 0;
                    transform       : rotate(0deg);
                }
            }

            &.swiper-slide-active {
                .student-testimonial-slider__img {
                    img {
                        opacity  : 1;
                        transform: rotate(0deg) scale(1);
                    }

                    &:hover {
                        img {
                            transform: rotate(0deg) scale(1.1);
                            opacity  : 0.95;
                        }
                    }
                }

                .student-testimonial-slider__content {
                    >* {

                        opacity  : 1;
                        transform: none;

                        @for $i from 0 to 15 {
                            &:nth-child(#{$i + 1}) {
                                transition-delay: $i * 0.1 + 0.2s;
                            }
                        }

                    }
                }
            }
        }

        &__img {
            width        : 100%;
            flex-shrink  : 0;
            height       : 300px;
            // transform          : translateX(-10px);
            cursor       : pointer;
            overflow     : hidden;
            border-radius: 5px;

            @include media-breakpoint-up(md) { 
                width    : 85%;
                height   : 450px;
            }

            img {
                width           : 100%;
                height          : 100%;
                object-fit      : cover;
                display         : block;
                opacity         : 0;
                transition      : all .5s ease;
                transform       : rotate(45deg) scale(1);
                transform-origin: top right;
                border-radius      : 5px;
            }
        }

        &__content {
            position       : relative;
            display        : flex;
            flex-direction : column;
            height         : 90%;
            justify-content: center;
            padding-right  : 25px;

            @include media-breakpoint-up(md) { 
                border         : 1px solid $gray-400;
                border-left    : 0;
                border-right   : 0;
            }

            >* {
                opacity   : 0;
                transform : translateY(25px);
                transition: all .2s ease;
            }

        }

        &__code {
            color        : $taylors-red;
            margin-bottom: 15px;
            display      : block;
            font-weight  : 500;
        }

        &__title {
            font-size    : 24px;
            font-weight  : 700;
            color        : #0d0925;
            margin-bottom: 20px;
        }

        &__text {
            color        : #4e4a67;
            margin-bottom: 30px;
            line-height  : 1.5em;
            min-height   : 70px;

            @include media-breakpoint-up(md) { 
                min-height: unset;
            }
        }

        &__button {
            position           : absolute;
            bottom             : -30px;
            right              : 0;
            display            : inline-flex;
            border-radius      : 50px;
            color              : black;
            text-decoration    : none;
            font-weight        : 500;
            justify-content    : center;
            text-align         : center;
            letter-spacing     : 1px;
            font-weight        : 900;
            z-index            : 22;
            transition         : all 0.3s ease-in-out;

            .arrow-mask {
                margin-left : 10px;
                margin-bottom: 2px;
                overflow    : hidden;

                .arrow-wrp {
                    width   : 15px;    
                    display : flex;
                    transform: translateX(-15px);
                    transition: all .3s ease-in-out;
                    img {
                        width: 15px;
                    }
                }
            }

            &:hover {
                color: $taylors-red;

                .arrow-wrp {
                    transform: translateX(0);
                    animation-name: arrows;
                    animation-duration: 1000ms;
                    animation-iteration-count: infinite;

                    @keyframes arrows {
                        0% { transform: translateX(-15px) }
                        100% { transform: translateX(0px) }
                    }
                }
            }

            @include media-breakpoint-up(md) { 
                bottom : 0;
            }
        }
        
        &__pagination {
            display   : flex;
            position  : absolute;
            z-index   : 21;
            right     : 0;
            text-align: center;
            left      : auto;
            margin    : auto;
            bottom    : -30px;
            transform : translateY(-50%);

            @include media-breakpoint-up(md) { 
                bottom : 0;
            }
            // @media screen and (max-width: 768px) {
            //     transform      : translateX(-50%);
            //     left           : 50% !important;
            //     top            : 205px;
            //     width          : 100% !important;
            //     display        : flex;
            //     justify-content: center;
            //     align-items    : center;
            // }

            &.swiper-pagination-bullets .swiper-pagination-bullet {
                margin: 0 5px;

                @include media-breakpoint-up(md) {
                    margin: 0 8px;
                }
            }

            .swiper-pagination-bullet {
                width        : 11px;
                height       : 11px;
                display      : block;
                border-radius: 10px;
                background   : #062744;
                opacity      : 0.2;
                transition   : all .3s ease;

                &-active {
                    width     : 11px;
                    height    : 11px;
                    opacity   : 1;
                    background: $taylors-red;
                }
            }

        }

        &__navigation {
            position: absolute;
            width   : 70px;
            top     : 0;
            right   : 0;

            .swiper-button-next,
            .swiper-button-prev {
                margin-top      : 0;
                width           : 25px;
                height          : 25px;
                background-size : 7px;
                right           : 0;
                background-color: white;
                border-radius   : 50px;
                top             : 10px;
                transition      : all .5s ease-in-out;

                &:hover {
                    background-color: black;

                    &:after {
                        color       : white;
                    }
                }

                &:after {
                    font-size   : 10px;
                    font-weight : bold;
                    color       : $taylors-red;
                }
            }
        }
    }
</style>