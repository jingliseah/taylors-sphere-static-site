import Vue from 'vue';
import SvgSprite from 'vue-svg-sprite';

export default function configure () {
    Vue.use(SvgSprite, { url: process.env.NODE_ENV === 'production' ? '/taylorsphere/storage/ts-assets/icons/icons.svg' : '/icons/icons.svg' })
}