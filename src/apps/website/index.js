import "bootstrap";
import "@/scss/index.scss";

import 'core-js';
import 'regenerator-runtime/runtime';

import vueConfig                    from "@/config/vue-config";
vueConfig();

import swiperConfig                 from '@/config/swiper-config';
swiperConfig();

import gsap                         from "gsap";
import { ScrollTrigger }            from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

import Splitting                    from "splitting";
import Vue                          from 'vue';
import { mapActions, mapGetters }   from "vuex";
import Swiper                       from 'swiper/bundle';
import store                        from '@/store/index';
import appConstants                 from "@/app-constants";
import LocomotiveScroll             from 'locomotive-scroll';
import sampleSize                   from 'lodash/sampleSize';
import { setScrollbarWidthCssVar, formatISODate, hexToRGB, getAdjustedImageLink } from "@/utilities/helpers";
import students                     from '@/mocks/students';

import CardCarousel                 from '@/components/card/card-carousel.vue';
import CustomHeader                 from '@/components/custom-header.vue';
import GenericModal                 from '@/components/generic-modal.vue';
import HScroller                    from '@/components/horizontal-scroller/h-scroller.vue';
import GenericCarousel              from '@/components/generic-carousel.vue';
import StudentCarousel              from '@/components/swipers/student-carousel-v2.vue';

const mqlMd = window.matchMedia('(min-width: 768px)');

new Vue({
    el: '#app',
    store,
    components: {
        CardCarousel,
        CustomHeader,
        GenericModal,
        HScroller,
        GenericCarousel,
        StudentCarousel,


        TfmPopup: () => import (/* webpackChunkName: 'ts-extras' */ '@/components/tfm-popup.vue')
    },
    data() {
        return {
            locoInstance: null,
            isScrollTriggerReady: false,

            hScrollWidth: 0,
            youtubeIframeLink: '',

            students,
            currentStudent: null,

            enableChat: appConstants.ENABLE_CHAT,
            hideStudentVideoSection: appConstants.HIDE_STUDENTS_VIDEO_SECTION,
            hideTfmEvents: appConstants.HIDE_TFM_EVENTS,
            hideArSection: appConstants.HIDE_AR_SECTION
        }
    },
    computed: {
        ...mapGetters([
            'closestUpcomingWeek',
            'categories',
            'latestAgendasFromNow'
        ]),
    },
    created () {
        this.retrieveMasterJSON()
    },
    mounted() {
        setScrollbarWidthCssVar();

        this.setupScene();
        this.initialiseLocoScroll()

        $(() => $('body').removeClass('is-loading'))
    },
    methods: {
        ...mapActions(['retrieveMasterJSON']),

        formatISODate,

        hexToRGB,

        getAdjustedImageLink,

        showVideoModal (youtubeLink) {
            this.youtubeIframeLink = youtubeLink;
            this.$nextTick(() => {
                this.$refs.videoModal.show();
            })
        },

        showStudentTestimonialModal (student) {
            if(typeof student == "number") {
                student = students[student]
            }
            this.currentStudent = student;
            this.$refs.testimonialModal.show();
        },

        async showStudentTestimonialVideoModal () {
            await this.$refs.testimonialModal.hide();
            this.$refs.testimonialVideoModal.show();
            $(this.$refs.testimonialVideoModal.$el).one('hidden.bs.modal', () => this.$refs.testimonialModal.show())
        },

        handleStudentTestimonialVideoModalHidden () {
            this.$refs.testimonialModal.show();
        },

        getCategoryColor (category) {
            if (!category) return '#ffffff';
            const key = category.Key;
            const theCategory = this.categories.find(x => x.key === key);
            return theCategory.colour;
        },

        handleHScrollRead($event) {            
            if (!this.hideArSection) {
                this.animateSectionExperienceAR($event)
                // this.animateTestimonialsV2()
            }
            ScrollTrigger.refresh()
        },

        showAboutUsVideoModal (i) {
            this.$refs['aboutUsVideoModal' + i].show()
        },
        showComponentsModal (i) {
            this.$refs['componentsModal' + i].show()
        },
        showAboutStudentVideoModal (i) {
            this.$refs['aboutStudentVideoModal' + i].show()
        },
        showTestimonialModal (i) {
            this.$refs['testimonialModal' + i].show()
        },
        showTestimonialVideoModal (i) {
            this.$refs['testimonialVideoModal' + i].show()
        },
        initialiseTestimonialSwiper() {
            const testimonialSwiper = new Swiper(".testimonial-swiper", {
                spaceBetween: 10,
                slidesPerView: 1,
                centeredSlides: true,
                roundLengths: true,
                loop: true,
                allowTouchMove: true,
                loopAdditionalSlides: 30,
                breakpoints: {
                    768: {
                        centeredSlides: false,
                        slidesPerView: 3.8,
                    }
                },
            });
        },
        initialiseLocoScroll() {
            const locoScroll = new LocomotiveScroll({
                el: document.querySelector(".smooth-scroll"),
                smooth: true,
                smartphone: {
                    smooth: true
                },
                tablet: {
                    smooth: true
                },
                touchMultiplier: mqlMd.matches ? 2 : 3
            });

            this.locoInstance = locoScroll

            // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
            locoScroll.on("scroll", ScrollTrigger.update);

            // tell ScrollTrigger to use these proxy methods for the ".smooth-scroll" element since Locomotive Scroll is hijacking things
            ScrollTrigger.scrollerProxy(".smooth-scroll", {
                scrollTop(value) {
                    return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
                }, // we don't have to define a scrollLeft because we're only scrolling vertically.
                getBoundingClientRect() {
                    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
                },
                // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
                pinType: document.querySelector(".smooth-scroll").style.transform ? "transform" : "fixed"
            });            

            // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
            ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

            this.$nextTick(() => {
                

                this.isScrollTriggerReady = true;

                // init animataion
                this.animateSectionHero()
                    .then(() => {
                        if (appConstants.ENABLE_TFM_POPUP) this.$refs.tfmPopup.showPopup()
                    })
                this.animateSectionAboutUs()
                this.animateSectionIntellect()
                this.animateSectionCraft()
                this.animateSectionPracticalWisdom()
                this.animateSectionTSIntro()
                // this.animatePanel()
                
                if (!this.hideStudentVideoSection) {
                    this.animateSectionAboutStudent()
                }

                // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
                ScrollTrigger.refresh();
            })
        },

        setupScene() {
            const heroSection = this.$refs.heroSection;
            const decorations = heroSection.querySelectorAll('.decoration');
            
            gsap.set([decorations], {
                visibility: 'hidden'
            })

            // const testimonialsSectionV2 = this.$refs.testimonialsSectionV2;
            // const cards = testimonialsSectionV2.querySelectorAll('.card-wrapper');
            // gsap.set(cards, { 
            //     opacity: 0,
            //     y: 64,
            // })
        },

        animateTestimonialsV2 () {
            const testiIntroSection = this.$refs.testiIntroSection;
            const timelineIntro = gsap.timeline({
                scrollTrigger: {
                    scroller: '.smooth-scroll',
                    trigger: testiIntroSection,
                    pin: true,
                    scrub: true,
                    end: '+=1000'
                }
            })

            const sectionTitle = Array.from(testiIntroSection.querySelectorAll('.section-title .word .word-inner'));
            timelineIntro.fromTo(
                sectionTitle,
                {
                    delay: 1,
                    rotate: (index) => index === 0 ? '30deg' : '-30deg',
                    autoAlpha: 0,
                    scale: 8,
                    yPercent: 10,
                },
                {
                    rotate: '0',
                    yPercent: 0,
                    scale: 1,
                    duration: (index) => 4 + (index * 1),
                    stagger: 1,
                    autoAlpha: 1,
                    ease: 'power4.out'
                }
            )

            const testimonialsSectionV2 = this.$refs.testimonialsSectionV2;

            // setup the scene
            const cards = testimonialsSectionV2.querySelectorAll('.card.card-student-2');
            cards.forEach(item => {
                Splitting({ target: item.querySelectorAll('.card-title, .card-subheading'), by: 'words' })
            })

            

            const timeline = gsap.timeline({
                scrollTrigger: {
                    scroller: '.smooth-scroll',
                    trigger: testimonialsSectionV2,
                    scrub: 1,
                    // end is on the top of the view port one
                    // so if want it end faster need to increase the end
                    end: 'bottom 150%' 
                }
            })

            const cardWrapper = testimonialsSectionV2.querySelectorAll('.card-wrapper');

            cardWrapper.forEach((item, index) => {
                timeline.to(item, {
                    y: 0,
                    x: 0,
                    autoAlpha: 1,
                    ease: 'none',
                })
            })

            // cardWrapper.forEach(item => {
            //     gsap.to(item.querySelectorAll('.card-wrapper-inner'), {
            //         y: 0,
            //         x: 0,
            //         autoAlpha: 1,
            //         ease: 'none',
            //         scale: 1,
            //         scrollTrigger: {
            //             scroller: '.smooth-scroll',
            //             trigger: item,
            //             markers: true,
            //             start: 'top top+=80%',
            //             end: 'bottom top+=100%',
            //             scrub: 1
            //         }
            //     })
            // })
        },

        animateSectionHero() {
            const heroSection = this.$refs.heroSection;
            const decorationsContainer = heroSection.querySelector('.decorations-container');
            const taylorsSphereLogo = heroSection.querySelector('.taylors-sphere-logo');
            const sky = heroSection.querySelector('.sky');
            const clouds = heroSection.querySelector('.clouds');
            const redElement = heroSection.querySelector('.red-element');
            const basketball = heroSection.querySelector('.basketball');
            const roofAndTree = heroSection.querySelector('.roof-and-tree');
            const blockCDE = heroSection.querySelector('.block-c-d-e');
            const blockA = heroSection.querySelector('.block-a');
            const medicineStudents = heroSection.querySelector('.medicine-students');
            const pool = heroSection.querySelector('.pool');
            const floor_1 = heroSection.querySelector('.floor-1');
            const floor_2 = heroSection.querySelector('.floor-2');
            const floor_3 = heroSection.querySelector('.floor-3');
            const floor_4 = heroSection.querySelector('.floor-4');
            const drone = heroSection.querySelector('.drone');
            const duckie = heroSection.querySelector('.duckie');
            const orangeElement = heroSection.querySelector('.orange-element');
            const woodWork = heroSection.querySelector('.wood-work');
            const robotics = heroSection.querySelector('.robotics');
            const threedPrinters = heroSection.querySelector('.threed-printers');
            const students_1 = heroSection.querySelector('.students-1');
            const students_2 = heroSection.querySelector('.students-2');
            const students_3 = heroSection.querySelector('.students-3');
            const uniSquare = heroSection.querySelector('.uni-square');
            const art = heroSection.querySelector('.art');

            const timeline = gsap.timeline({ defaults: { ease: 'expo.out' } });
          

            return new Promise ((resolve, reject) => {
                timeline
                    .fromTo(
                        decorationsContainer,
                        {
                            scale: 3,
                            // x: 300,
                            y: -600
                        },
                        {
                            scale: 1,
                            // x: 0,
                            y: 0,
                            duration: 4
                        }
                    )
                    .fromTo(
                        [blockCDE, blockA, roofAndTree],
                        {
                            visibility: 'visible',
                            clipPath: 'inset(0% 0% 100% 0%)',
                            translateY: '-30%'
                        },
                        {
                            clipPath: 'inset(0% 0% 0% 0%)',
                            translateY: 0,
                            duration: 2,
                            stagger: {
                                amount: 0.3
                            },
                        },
                        '<'
                    )
                    .fromTo(
                        [floor_1, floor_2, floor_3, floor_4, pool],
                        {
                            visibility: 'visible',
                            clipPath: 'inset(0% 0% 100% 0%)',
                            translateY: '-30%'
                        },
                        {
                            clipPath: 'inset(0% 0% 0% 0%)',
                            translateY: 0,
                            duration: 2,
                            stagger: {
                                amount: 0.3
                            },
                        },
                        ">-1.7"
                    )
                    .fromTo(
                        sky,
                        {
                            visibility: 'visible',
                            autoAlpha: 0
                        },
                        {
                            duration: 2,
                            autoAlpha: 1,
                        },
                        ">-1.6"
                    )
                    .fromTo(
                        medicineStudents,
                        {
                            visibility: 'visible',
                            autoAlpha: 0
                        },
                        {
                            duration: 2,
                            autoAlpha: 1,
                        },
                        ">-1.7"
                    )
                    .fromTo(
                        drone,
                        {
                            visibility: 'visible',
                            scale: 1.5,
                            translateX: -5000,
                            translateY: -100,
                        },
                        {
                            duration: 2.5,
                            scale: 1,
                            translateX: 0,
                            translateY: 0,
                            onComplete: () => {
                                drone.classList.add("floating-2", "animated")
                            }
                        },
                        ">-1.8"
                    )
                    .fromTo(
                        orangeElement,
                        {
                            visibility: 'visible',
                            translateY: -300,
                            autoAlpha: 0
                        },
                        {
                            duration: 2,
                            translateY: 0,
                            autoAlpha: 1,
                        },
                        ">-1.8"
                    )
                    .fromTo(
                        duckie,
                        {
                            visibility: 'visible',
                            scale: 0,
                            translateX: -100,
                            rotation: 0,
                            autoAlpha: 0
                        },
                        {
                            duration: 2,
                            scale: 1,
                            translateX: 0,
                            rotation: 360*2,
                            autoAlpha: 1,
                        },
                        ">-1.8"
                    )
                    .fromTo(
                        robotics,
                        {
                            visibility: 'visible',
                            autoAlpha: 0
                        },
                        {
                            duration: 2,
                            autoAlpha: 1,
                        },
                        ">-1.8"
                    )
                    .fromTo(
                        woodWork,
                        {
                            visibility: 'visible',
                            translateX: -100,
                            translateY: -100,
                            autoAlpha: 0
                        },
                        {
                            duration: 2,
                            translateX: 0,
                            translateY: 0,
                            autoAlpha: 1,
                        },
                        ">-1.8"
                    )
                    .fromTo(
                        art,
                        {
                            visibility: 'visible',
                            translateX: 100,
                            autoAlpha: 0
                        },
                        {
                            duration: 2,
                            translateX: 0,
                            autoAlpha: 1,
                        },
                        ">-2"
                    )
                    .fromTo(
                        threedPrinters,
                        {
                            visibility: 'visible',
                            translateX: -100,
                            translateY: 0,
                            autoAlpha: 0
                        },
                        {
                            duration: 2,
                            translateX: 0,
                            translateY: 0,
                            autoAlpha: 1,
                        },
                        ">-1.8"
                    )
                    .fromTo(
                        uniSquare,
                        {
                            visibility: 'visible',
                            translateX: -100,
                            translateY: 0,
                            autoAlpha: 0
                        },
                        {
                            duration: 3,
                            translateX: 0,
                            translateY: 0,
                            autoAlpha: 1,
                        },
                        ">-1.8"
                    )
                    .fromTo(
                        students_1,
                        {
                            visibility: 'visible',
                            // scale: 0,
                            autoAlpha: 0,
                            rotateX: '-90deg',
                            transformOrigin: 'bottom bottom',
                        },
                        {
                            rotateX: '0',
                            duration: 2.5,
                            // scale: 1,
                            autoAlpha: 1,
                            ease: "elastic.out(1, 0.6)",
                        },
                        ">-2.8"
                    )
                    .fromTo(
                        students_2,
                        {
                            visibility: 'visible',
                            autoAlpha: 0
                        },
                        {
                            duration: 2,
                            autoAlpha: 1,
                        },
                        ">-1.8"
                    )
                    .fromTo(
                        students_3,
                        {
                            visibility: 'visible',
                            autoAlpha: 0
                        },
                        {
                            duration: 2,
                            autoAlpha: 1,
                        },
                        ">-1.8"
                    )
                    .fromTo(
                        basketball,
                        {
                            visibility: 'visible',
                            translateY: 100,
                            autoAlpha: 0
                        },
                        {
                            duration: 2,
                            translateY: 0,
                            autoAlpha: 1,
                        },
                        ">-1.8"
                    )
                    .fromTo(
                        redElement,
                        {
                            visibility: 'visible',
                            translateY: 100,
                            autoAlpha: 0
                        },
                        {
                            duration: 2,
                            translateY: 0,
                            autoAlpha: 1,
                        },
                        ">-1.8"
                    )
                    .fromTo(
                        [ clouds ],
                        {
                            visibility: 'visible',
                            clipPath: 'inset(0% 100% 0% 0%)',
                            translateX: '-30%'
                        },
                        {
                            clipPath: 'inset(0% 0% 0% 0%)',
                            translateX: 0,
                            duration: 2,
                            stagger: {
                                amount: 0.3
                            },
                            onComplete: () => {
                                clouds.classList.add("floating-2", "animated")
                            }
                        },
                        ">-1.8"
                    )
                    .fromTo(
                        [ taylorsSphereLogo ],
                        {
                            visibility: 'visible',
                            translateY: '100%',
                            autoAlpha: 0,
                        },
                        {
                            translateY: 0,
                            autoAlpha: 1,
                            duration: 2,
                            ease: 'power4.out',
                            onComplete: () => resolve()
                        },
                        ">-2"
                    )
                    // .from(
                    //     '.custom-header',
                    //     { 
                    //         y: -100, 
                    //         duration: 2, 
                    //         autoAlpha: 0, 
                    //         ease: "power4.out",
                    //     }, 
                    //     ">-1.8"
                    // )
                if (appConstants.ENABLE_CHAT) {
                    timeline.from(
                        '.chat',
                        { 
                            y: 100,
                            duration: 2, 
                            autoAlpha: 0, 
                            ease: "power4.out",
                            onComplete: () => {
                                decorationsContainer.classList.add("floating-2", "animated")
                            }
                        }, 
                        ">-2"
                    )
                }
                    
            })
        },
        animateSectionAboutUs() {
            const sectionAboutUs = gsap.timeline({
                scrollTrigger: {
                    trigger: ".section-about-us",
                    scroller: ".smooth-scroll",
                    scrub: true,
                    pin: true,
                    start: "top bottom",
                    end: "top top",
                    // markers: true
                }
            });

            sectionAboutUs.set('.section-about-us .title', { x: '-101%', opacity: 0 })
            sectionAboutUs.from(".section-about-us .line-vertical", { scaleY: 0, transformOrigin: "top bottom", ease: "none" }, 0)
                .to('.section-about-us .title', 1, { x: '0%', opacity: 1 })
                .to(".section-about-us", { backgroundColor: "#000000", color: "#FFFFFF" }, 0);
        },
        animateSectionIntellect() {
            const intellectSection = this.$refs.intellectSection;
            const rings = intellectSection.querySelectorAll('.rings')
            const dotsElement1 = intellectSection.querySelector('.dots-element-1')
            const dotsElement2 = intellectSection.querySelector('.dots-element-2')

            const sectionIntellect = gsap.timeline({
                scrollTrigger: {
                    trigger: ".section-intellect",
                    scroller: ".smooth-scroll",
                    scrub: 0.8,
                    // pin: true,
                    start: () => 'top 60%',
                    end: () => 'bottom 100%',
                    // markers: true
                }
            });
            return new Promise ((resolve, reject) => {
                sectionIntellect
                    .from('.section-intellect .summary_list_item', { x: 100, stagger: 0.1, duration:"6", autoAlpha: 0, ease: "power2"})
                    .from(".section-intellect .main-kv", { x: 100, duration: 6, autoAlpha: 0, ease: "linear" }, ">-1.8")
                    .from(".section-intellect .blurp", { x: 100, duration: 6, autoAlpha: 0, ease: "linear" }, ">-1.8")
                    .from(".section-intellect .dots-element-1", { x: 100, duration: 6, autoAlpha: 0, ease: "linear", 
                        onComplete: () => {
                            dotsElement1.classList.add("floating-2", "animated")
                        }
                    }, ">-1.8")
                    .from(".section-intellect .dots-element-2", { x: 100, duration: 6, autoAlpha: 0, ease: "linear", 
                        onComplete: () => {
                            dotsElement2.classList.add("floating-2", "animated")
                        }
                    }, ">-1.8")
                    .from(".section-intellect .rings", { y: 100, stagger: 0.2,duration:"6",autoAlpha: 0,ease: "power2",
                        onComplete: () => {
                            rings.forEach(item => {
                                item.classList.add("floating-1", "animated")
                            })
                            resolve()
                        }
                    }, ">-1.8")
                    .from(".section-intellect .red-circle", { y: 100, duration: 6, autoAlpha: 0, ease: "linear" }, ">-1.8")
            })
        },
        animateSectionCraft() {
            const craftSection = this.$refs.craftSection;
            const rings = craftSection.querySelectorAll('.rings')
            const dotsElement1 = craftSection.querySelector('.dots-element-1')
            const dotsElement2 = craftSection.querySelector('.dots-element-2')

            const sectionCraft = gsap.timeline({
                scrollTrigger: {
                    trigger: ".section-craft",
                    scroller: ".smooth-scroll",
                    scrub: true,
                    // pin: true,
                    start: () => 'top 50%',
                    end: () => 'bottom 100%',
                    // markers: true
                }
            });
            return new Promise ((resolve, reject) => { 
                sectionCraft
                    .from('.section-craft .summary_list_item', { x: 100, stagger: 0.1, duration:"6", autoAlpha: 0, ease: "power2"})
                    .from(".section-craft .main-kv", { x: 100, duration: 6, autoAlpha: 0, ease: "linear" }, ">-1.8")
                    .from(".section-craft .blurp", { x: 100, duration: 6, autoAlpha: 0, ease: "linear" }, ">-1.8")
                    .from(".section-craft .dots-element-1", { x: 100, duration: 6, autoAlpha: 0, ease: "linear", 
                        onComplete: () => {
                            dotsElement1.classList.add("floating-2", "animated")
                        }
                    }, ">-1.8")
                    .from(".section-craft .dots-element-2", { x: 100, duration: 6, autoAlpha: 0, ease: "linear", 
                        onComplete: () => {
                            dotsElement2.classList.add("floating-2", "animated")
                        }
                    }, ">-1.8")
                    .from(".section-craft .rings", { y: 100, stagger: 0.2,duration:"6",autoAlpha: 0,ease: "power2",
                        onComplete: () => {
                            rings.forEach(item => {
                                item.classList.add("floating-1", "animated")
                            })
                            resolve()
                        }
                    }, ">-1.8")
                    .from(".section-craft .red-circle", { y: 100, duration: 6, autoAlpha: 0, ease: "linear" }, ">-1.8")
            })
        },
        animateSectionPracticalWisdom() {
            const practicalWisdomSection = this.$refs.practicalWisdomSection;
            const rings = practicalWisdomSection.querySelectorAll('.rings')
            const dotsElement1 = practicalWisdomSection.querySelector('.dots-element-1')
            const dotsElement2 = practicalWisdomSection.querySelector('.dots-element-2')

            const sectionPracticalWisdom = gsap.timeline({
                scrollTrigger: {
                    trigger: ".section-practical-wisdom",
                    scroller: ".smooth-scroll",
                    scrub: true,
                    // pin: true,
                    end: 'bottom 80%',
                    // end: '+=' + innerHeight * 2,
                    // markers: true
                }
            });
            return new Promise ((resolve, reject) => { 
                sectionPracticalWisdom
                    .from('.section-practical-wisdom .summary_list_item', { x: 100, stagger: 0.1, duration:"6", autoAlpha: 0, ease: "power2"})
                    .from(".section-practical-wisdom .main-kv", { x: 100, duration: 6, autoAlpha: 0, ease: "linear" }, ">-1.8")
                    .from(".section-practical-wisdom .blurp", { x: 100, duration: 6, autoAlpha: 0, ease: "linear" }, ">-1.8")
                    .from(".section-practical-wisdom .dots-element-1", { x: 100, duration: 6, autoAlpha: 0, ease: "linear", 
                        onComplete: () => {
                            dotsElement1.classList.add("floating-2", "animated")
                        }
                    }, ">-1.8")
                    .from(".section-practical-wisdom .dots-element-2", { x: 100, duration: 6, autoAlpha: 0, ease: "linear", 
                        onComplete: () => {
                            dotsElement2.classList.add("floating-2", "animated")
                        }
                    }, ">-1.8")
                    .from(".section-practical-wisdom .rings", { y: 100, stagger: 0.2,duration:"6",autoAlpha: 0,ease: "power2",
                        onComplete: () => {
                            rings.forEach(item => {
                                item.classList.add("floating-1", "animated")
                            })
                            resolve()
                        }
                    }, ">-1.8")
                    .from(".section-practical-wisdom .red-circle", { y: 100, duration: 6, autoAlpha: 0, ease: "linear" }, ">-1.8")
            })
        },
        animateSectionAboutStudent() {
            const sectionAboutStudent = gsap.timeline({
                scrollTrigger: {
                    trigger: ".section-about-student",
                    scroller: ".smooth-scroll",
                    scrub: true,
                    // pin: true,
                    start: "top bottom",
                    end: "top top",
                    // markers: true
                }
            });

            sectionAboutStudent.set('.section-about-student .title', { x: '-101%', opacity: 0 })
            sectionAboutStudent.from(".section-about-student .line-vertical", { scaleY: 0, transformOrigin: "top bottom", ease: "none" }, 0)
                .to('.section-about-student .title', 1, { x: '0%', opacity: 1 })
                .to(".section-about-student", { backgroundColor: "#000000", color: "#FFFFFF" }, 0);
        },
        animateSectionExperienceAR(hScrollWidth) {
            const sectionExperienceAR = gsap.timeline({
                scrollTrigger: {
                    trigger: ".section-experience-ar",
                    scroller: ".smooth-scroll",
                    scrub: true,
                    // markers: true,
                    // pin: true,
                    start: "top bottom",
                    end: "top top"
                }
            });

            sectionExperienceAR
                .from(".ea-summary_list_item", { y: 100, stagger: 0.2, autoAlpha: 0, ease: "power2" })
                .to('.section-experience-ar .ea-iframe', { width:'100%', opacity: 1, visibility: 'visible'})
        },
        animateSectionTSIntro () {
            const tsIntroSection = this.$refs.tsIntroSection;
            const timeline = gsap.timeline({
                scrollTrigger: {
                    scroller: '.smooth-scroll',
                    trigger: tsIntroSection,
                    pin: true,
                    scrub: true,
                    end: () => '+=1500'
                }
            });

            const title = tsIntroSection.querySelector('.title');
            const line2 = tsIntroSection.querySelector('.line-2');

            timeline
                .from(line2, {
                    y: mqlMd.matches ? 1000 : 400,
                    ease: 'none',
                    duration: mqlMd.matches ? 4 : 2,
                })
                .to(title, {
                    delay: mqlMd.matches ? 1.5 : 1,
                    duration: mqlMd.matches ? 5 : 2,
                    scale: 25,
                    translateX: '380%',
                    translateY: '650%',
                    ease: 'none',
                    autoAlpha: 0
                })
        },

        getEventDate (event) {
            if (event.releaseDate) {
                return event.releaseDate;
            }

            if (event.startDate) {
                return event.startDate;
            }

            if (event.endDate) {
                return event.endDate;
            }
        },

        getEventTiming (event) {
            const startFormat = 'MMMM d, h:mm A';
            const format = 'h:mm A';

            if (event.releaseDate) {
                return this.formatISODate(event.releaseDate, startFormat);
            }

            let timeString = '';
            if (!event.ignoreStartTime && event.startDate) {
                timeString = this.formatISODate(event.startDate, startFormat);

                if (!event.ignoreEndTime && event.endDate) {
                    timeString += ' - ';
                }
            }

            if (!event.ignoreEndTime && event.endDate) {
                timeString += this.formatISODate(event.endDate, format);
            }
            
            return timeString;
        },

        getAgendaSuggestions (componentId) {
            switch (componentId) {
                case 'bizpod':
                    return sampleSize(
                        this.latestAgendasFromNow.filter(x => x.category?.Key === appConstants.AGENDA_CATEGORY_BIZPOD),
                        6
                    )
                case 'tmm':
                    return sampleSize(
                        this.latestAgendasFromNow
                            .filter(x => x.category?.key && [appConstants.AGENDA_CATEGORY_TMM_WORKSHOP, appConstants.AGENDA_CATEGORY_TMM_FIRESIDE].includes(x.category?.Key)),
                        6
                    )
                case 'life-skills':
                case 'research':
                case 'tcf':
                default: 
                    return sampleSize(this.latestAgendasFromNow, 6);
            }
        },
    }
})