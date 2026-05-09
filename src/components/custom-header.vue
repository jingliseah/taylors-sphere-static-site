<template>
    <div class="custom-header">
        <div class="background"></div>
        <img class="taylor-logo" src="~@/assets/img/icons/logo.png" alt="Taylor Logo" height='65'>
        
        <div class="hamburger-menu">
            <input id="menu__toggle" type="checkbox" />
            <label class="menu__btn" for="menu__toggle">
            <span></span>
            </label>
            
            <div class="menu__box pe-md-3 ps-md-0 px-5" >
                <div class="d-flex flex-column justify-content-between h-100">
                    <ul class="list-unstyled">
                        <li v-for="(item, index) in menuList" :key="index">
                            <a class="menu__item"  
                                @click="anchorTo($event, item.link)"
                                :target="item.target ? item.target : '_self'"
                                :href="item.link">{{item.label}}</a>
                        </li>
                    </ul>
                    <slot name="socialnetwork"></slot>                    
                </div>
            </div> 
        </div>
    </div>
</template>


<script>

export default {
    data(){
        return{
            menuList: [
                {
                    label: 'Intellect',
                    link: '#section-intellect'
                }, 
                {
                    label: 'Craft',
                    link: '#section-craft'
                }, 
                {
                    label: 'Practical Wisdom',
                    link: '#section-practical-wisdom'
                }, 
                {
                    label: 'Taylor’sphere™ Components',
                    link: '#section-taylor-sphere-components'
                }, 
                {
                    label: 'Student Testimonials',
                    link: '#section-testimonial'
                }, 
                // {
                //     label: 'Experience AR',
                //     link: '#section-experience-ar'
                // }, 
                {
                    label: 'Taylor’s Future Movement',
                    link: '/taylorsphere/taylors-future-movement',
                    target: '_blank'
                }, 
            ]
        }
    },
    props: {
        title: {
            type: String, 
            default: 'Student 1'
        },
        description: {
            type: String, 
            default: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took'
        },
        link: String,
        locomotive: Object
    },
    methods: {
        triggerModal(){
            alert('adf')
            $('.bd-example-modal-lg').modal('show')
        },
        anchorTo(event, link){
            // anchor 
            if (link.indexOf('#') !== -1) {
                event.preventDefault();
                this.locomotive.scrollTo(link)    
                $('.menu__btn').click()
            }
        }
    }
}
</script>

