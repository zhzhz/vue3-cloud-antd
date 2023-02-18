import { defineStore } from 'pinia';

/** 主题色 */
export type ThemeName = 'light' | 'dark' | 'realDark';
// export type { Theme };

export type ThemeState = {
  navTheme: ThemeName; // theme for nav menu
  primaryColor: string; // '#F5222D', // primary color of ant design
  layout: 'sidemenu' | 'topmenu'; // nav menu position: `sidemenu` or `topmenu`
  contentWidth: 'Fluid' | 'Fixed'; // layout of content: `Fluid` or `Fixed`, only works when layout is topmenu
  fixedHeader: false; // sticky header
  fixSiderbar: false; // sticky siderbar
  colorWeak: false;
  menu: {
    locale: true;
  };
  title: string;
  pwa: false;
  iconfontUrl: string;
  // production: process.env.NODE_ENV === 'production' && process.env.VUE_APP_PREVIEW !== 'true'
};

export const defaultConfig: ThemeState = {
  navTheme: 'dark', // theme for nav menu
  primaryColor: 'rgb(24, 144, 255)', // '#F5222D', // primary color of ant design
  layout: 'sidemenu', // nav menu position: `sidemenu` or `topmenu`
  contentWidth: 'Fluid', // layout of content: `Fluid` or `Fixed`, only works when layout is topmenu
  fixedHeader: false, // sticky header
  fixSiderbar: false, // sticky siderbar
  colorWeak: false,
  menu: {
    locale: true,
  },
  title: 'vite-antdv-admin',
  pwa: false,
  iconfontUrl: '',
  // production: process.env.NODE_ENV === 'production' && process.env.VUE_APP_PREVIEW !== 'true',
};

export const useThemeStore = defineStore({
    id: 'theme',
    state: (): ThemeState => ({
      ...defaultConfig,
      // ...localThemeConfig,
    }),
    getters: {
      getNavTheme(): ThemeName {
        return this.navTheme;
      },
    },
    // actions: {
    //   setTheme(theme: Partial<ThemeState>) {
    //     for (const key in theme) {
    //       this[key] = theme[key];
    //     }
    //     // document.documentElement.style.setProperty(key, nextTheme[key]);
    //     theme.navTheme && setRealDarkTheme(theme.navTheme);
    //     Storage.set(THEME_KEY, JSON.stringify(this.$state));
    //   },
    //   /** antdv自带的改变主题颜色方法，但可以配置的颜色很有限，仅6种 */
    //   fillColor(theme: Theme) {
    //     this.primaryColor = theme.primaryColor ?? this.primaryColor;
    //     ConfigProvider.config({
    //       theme,
    //     });
    //     Storage.set(THEME_KEY, JSON.stringify(this.$state));
    //   },
    // },
  });