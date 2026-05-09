const recaptchaSiteKey = document.querySelector('meta[name="grecaptcha-site-key"]')?.getAttribute('content') || '';

export default {
    RECAPTCHA_SITE_KEY: recaptchaSiteKey,

    AGENDA_CATEGORY_TMM_WORKSHOP: 'd533be6b-2546-4bb0-b638-8c5b0fd07bf7',
    AGENDA_CATEGORY_TMM_FIRESIDE: 'a689a1cc-45db-4e7f-80a3-3bc7a5cf51cd',
    AGENDA_CATEGORY_BIZPOD: '48b4e0ec-e818-4540-af17-bf0e151910ce',

    ENABLE_TFM_POPUP: true,
    ENABLE_CHAT: true,
    HIDE_STUDENTS_VIDEO_SECTION: true,
    HIDE_TFM_EVENTS: false,
    HIDE_AR_SECTION: true
}
