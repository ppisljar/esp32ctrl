const defaultOptions = {
  iconSets: [
    {
      name: 'simpleLine', // Name displayed on tab
      css: 'https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.4.1/css/simple-line-icons.css', // CSS url containing icons rules
      prefix: 'icon-', // CSS rules prefix to identify icons
      displayPrefix: ''
    },{
      name: 'fontAwesome', // Name displayed on tab
      css: 'https://use.fontawesome.com/releases/v5.8.1/css/all.css', // CSS url containing icons rules
      prefix: 'fa-', // CSS rules prefix to identify icons
      displayPrefix: 'fas fa-icon'
    },{
      name: 'material', // Name displayed on tab
      css: 'https://cdn.materialdesignicons.com/3.5.95/css/materialdesignicons.min.css', // CSS url containing icons rules
      prefix: 'mdi-', // CSS rules prefix to identify icons
      displayPrefix: 'mdi mdi-icon'
    }
  ]
};

export default defaultOptions;
