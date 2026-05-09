<template>
    <div class="popup popup-tfm" style="opacity: 0; visibility: hidden; transform: translate(0px, 100%);">
        <div class="popup-header">
            <button class="btn btn-close-popup" @click="closePopup">
                <svg v-svg symbol="sprite-x" class="icon"></svg>
            </button>
        </div>
        <div class="popup-body">
            <div class="d-flex flex-column flex-md-row align-items-center">
                <div class="tfm-kv align-self-start">
                    <img src="~@/assets/img/hero-section/tfm-kv.svg" class="main-logo" alt="Taylor Future Movement">   
                </div>
                <div class="description p-4">
                    <p class="mb-0">Join our digital open day from 23 Jun–15 Aug! Attend free workshops, counselling, and “Ask me anything” sessions with successful personalities like Yuna, Datuk Nicol David and Datin Paduka Marina Mahathir. <a target="_blank" href="/taylorsphere/taylors-future-movement" class="text-white stretched-link">Join The Fun</a></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import gsap from 'gsap';

export default {
    methods: {
        showPopup () {
            console.log('show')
            return new Promise((resolve, reject) => {
                gsap.to(this.$el, {
                    y: 0,
                    ease: 'power3.out',
                    duration: 1,
                    autoAlpha: 1,
                    onComplete: () => resolve()
                })
            })
        },
        closePopup () {
            return new Promise((resolve, reject) => {
                gsap.to(this.$el, {
                    y: '100%',
                    ease: 'power3.out',
                    duration: 1,
                    autoAlpha: 0,
                    onComplete: () => resolve()
                })
            })
        }
    }
}
</script>

<style lang="scss">
    .popup.popup-tfm {
        position: fixed;
        bottom: 0;
        width: 90%;
        left: 0;
        right: 0;
        margin: auto;

        * {
            backface-visibility: hidden;
        }

        &::before {
            content: '';
            background-color: $orange;
            height: 100%;
            width: 100%;
            display: block;
            top: 0;
            left: 0;
            position: absolute;
            transform: skew(-4deg);
        }

        .popup-body {
            z-index: 1;
            position: relative;
            padding: 1rem 0;
        }

        .popup-header {
            .btn-close-popup {
                padding: 0;
                position: absolute;
                right: 0;
                top: 0;
                z-index: 4;

                .icon {
                    color: #fff;
                    height: 3rem;
                    width: 3rem;
                }

                &:focus {
                    box-shadow: none;
                }
            }
        }

        .tfm-kv {
            position: relative;
            margin-top: -5rem;
            width: 190px;
            height: 110px;
            flex-shrink: 0;

            img {
                max-width: 100%;
                height: 100%;
            }
        }

        .description {
            font-weight: 500;
            color: #fff;

            p {
                font-size: 0.8rem;
            }
        }

        @include media-breakpoint-up(md) {
            max-width: 80%;
            bottom: 15px;

            &::before {
                transform: skew(-8deg);
            }

            .description {
                p {
                    font-size: 1rem;
                }
            }

            .tfm-kv {
                margin-top: 0;
                margin-left: -2rem;
            }
        }

        @include media-breakpoint-up (xxl) {
            max-width: 60%;
        }

        @media (min-width: 1600px) {
            max-width: 50%;
        }

        
    }
</style>