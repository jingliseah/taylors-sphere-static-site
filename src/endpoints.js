const staticAssetsPath = process.env.NODE_ENV === 'development' ? '' : '/taylorsphere/storage/tfm-assets';

export default {
    MASTER_JSON: staticAssetsPath + '/mocks/master-json-files.json',
    TFM_CONTACT_FORM: '/future-movement/contact-us-form-submissions'
}