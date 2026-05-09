<template>
    <div :id="modalId" class="modal modal-generic fade" ref="modal" v-on="{ 'hide.bs.modal': pauseAnyVideos }">
        <div class="modal-dialog modal-dialog-centered" :class="{ [modalSize]: true }">
            <div class="modal-content">
                <div class="modal-header pb-0">
                    <h5 class="modal-title" v-if="modalTitle">{{ modalTitle }}</h5>
                    <button type="button" class="btn btn-fab ms-auto px-0 pt-0" data-bs-dismiss="modal" aria-label="Close">
                        <div id="mdiv">
                            <div class="mdiv" :class="{ 'variant-light': isLightCloseButton }">
                                <div class="md"></div>
                            </div>
                        </div>
                    </button>
                </div>
                <div class="modal-body">
                    <slot name="modal-content"></slot>
                </div>
            </div>
        </div>
    </div>  
</template>

<script>
import { closeModal, showModal } from '@/utilities/helpers';

export default {
    props: {
        modalId: {
            type: String,
            required: true
        },
        modalSize: {
            type: String,
            default: 'modal-m'
        },
        modalTitle: String,
        isLightCloseButton: Boolean
    },
    methods: {
        show () {
            this.$emit('show')
            return showModal('#' + this.modalId)
                .then(() => this.$emit('shown'))
        },
        hide () {
            this.$emit('hide')
            
            return closeModal('#' + this.modalId)
                .then(() => this.$emit('hidden'))
        },
        pauseAnyVideos () {
            const iframe = this.$el.querySelector('iframe')
            if (iframe) {
                iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*')
            }

            const video = this.$el.querySelector('video');
            if (video) {
                video.pause()
            }
        }
    }
}
</script>

<style>

</style>