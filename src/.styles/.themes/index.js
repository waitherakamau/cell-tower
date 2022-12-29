import React, { useEffect } from "react";
import { ThemeProvider } from 'styled-components';
import { connect } from 'react-redux';

import GlobalStyle from './useTheme';
import { GlobalStyles as BaseStyles } from 'twin.macro'
import { Actions } from '@services';


const MainLayout = (props) => {

  let { children, theme, updateTheme } = props;
  let ibtheme = localStorage.getItem('ibtheme') || theme['mode']

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('ibtheme')) {
    // dark mode
    ibtheme = 'light' //dark
  }
  useEffect(() => {
    localStorage.setItem('ibtheme', ibtheme);
    updateTheme(ibtheme)
  }, [ibtheme]);


  const currentTheme = (themes) => {

    let setCurrentTheme = { ...theme }

    if(themes.mode && themes.mode === 'light'){
      setCurrentTheme = { ...setCurrentTheme, ...themes.lightTheme }
      delete setCurrentTheme.darkTheme
      delete setCurrentTheme.lightTheme
    }else if(themes.mode && themes.mode === 'dark'){
      setCurrentTheme = { ...setCurrentTheme, ...themes.darkTheme }
      delete setCurrentTheme.darkTheme
      delete setCurrentTheme.lightTheme
    }

    return setCurrentTheme
  }


    return (
        <ThemeProvider theme={() => currentTheme(theme)}>
            <>
                <BaseStyles />
                <GlobalStyle />

                {children}
            </>
        </ThemeProvider>
    );
}

const mapStateToProps = state =>{
    return {
      theme: state.theme
    }
};

const mapDispatchToProps = dispatch => {
	return {
		updateTheme : params => dispatch(Actions.updateTheme(params))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);