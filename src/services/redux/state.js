const state =  {
  title: 'faulu',
  theme: {
      mode: 'light',
      textZoom: 'normal',
      darkTheme: {
        primaryColor: '#662D91',
        secondaryColor: '#F79441',
        infoColor: '#b3dbff',
        successColor: '#16AB21',
        warningColor: '#f39c12',
        dangerColor: '#FF2326',
        lightColor: '#000000',
        darkColor: '#ffffff',
        textColor: '#f2f2f2',
        textDark: '#ffffff',
        bgColor: '#1f2937',
        ftBgColor: 'rgba(215, 206, 199, 0.5)',
        footerColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: '#b3b3b3',
        themeColor: '#111827',
        wizardBg: '#afb4b6',
        tableEven: '#4b5563',
        tableHeader: '#373e49',
        panelHeader: '#005299',
        borderPrimary: '#531173',
        focusColor: '#522475'
      },
      lightTheme: {
        primaryColor: '#662D91',
        secondaryColor: '#F79441',
        infoColor: '#F0F8FF',
        successColor: '#16AB21',
        warningColor: '#f39c12',
        dangerColor: '#FF2326',
        lightColor: '#ffffff',
        darkColor: '#000000',
        textDark: '#222222',
        textColor: '#4A4A4A',
        bgColor: '#E6E7E8',
        ftBgColor: 'rgba(215, 206, 199, 0.5)',
        footerColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: '#979797',
        themeColor: '#f9fafb',
        wizardBg: '#959B9E',
        tableEven: '#e5e7eb',
        tableHeader: '#e2e4e9',
        panelHeader: '#F0F8FF',
        borderPrimary: '#531173',
        focusColor: '#300a43'
      }
  },
  activeSideMenu: 'Dashboard',
  activeSideMiniMenu: 'Dashboard',
  userData: {
    userid: '',
    personalInfo: {

    },
    agentInfo: {
      
    },
    accountInfo: {
      
    },
    securityInfo: {
      
    },
    permissionsInfo: {
      
    }
  },
  activeData: {
    activeAccount: {
      account: ""
    }
  },
  accountData: {
    '1234567890123': {
      ministatement: []
    }
  },
  chat:{
    showChat : false,
    chatView : 'forex', // fd, cs
    chatData : {}
  }
}
export default state