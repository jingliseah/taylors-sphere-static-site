<template>
    <div class="card card-video position-relative">
        <div class="thumbnail">
            <div class="ratio ratio-16x9">
                <slot name="thumbnail"></slot>
            </div>
            <div class="overlay"></div>
            <div class="icon">
                <img src="~@/assets/img/icons/play.svg" alt="Play">
            </div>
        </div>
        <div class="card-body px-0 px-md-3">
            <h5 class="card-title"><a class="stretched-link text-decoration-none text-white" href="#" @click.prevent="$emit('link-click')" v-html="title"></a></h5>
            <p class="card-text">{{description}}</p>
        </div>            
    </div>
</template>


<script>
export default {
    props: {
        title: {
            type: String, 
            default: 'Student 1'
        },
        description: {
            type: String, 
            default: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took'
        },
        link: String
    },
    methods: {
    }
}
</script>

