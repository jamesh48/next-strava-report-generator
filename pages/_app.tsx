/* eslint-disable react/no-unknown-property */
import '../styles/globals.css'
import type {
  APIEntry,
  CurrentActivity,
} from '@components/StravaEntries/EntryTypes'
import { useFetchData } from '@lib'
import { createTheme, ThemeProvider, useTheme } from '@mui/material'
import { useSelector } from '@redux/reduxHooks'
import { appInitialState, getDarkModeCondition } from '@redux/slices'
import GlobalStore from '@redux/store'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import darkTheme from '../theme/muiDarkTheme'
import lightTheme from '../theme/muiLightTheme'

const ThemeComponent = (props: AppProps & { initialDarkMode?: boolean }) => {
  const darkMode = useSelector(getDarkModeCondition)

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <AppComponent {...props} />
    </ThemeProvider>
  )
}
const AppComponent = ({ Component, pageProps }: AppProps) => {
  const theme = useTheme()

  return (
    <>
      <Component {...pageProps} />
      <style jsx global>{`
        html {
          height: 100vh;
          width: 100vw;
          background-color: ${theme.palette.baseBackground.main};
        }
      `}</style>
    </>
  )
}

const StravaReportGenerator = (
  props: AppProps<{
    clientSideTokens?: { mapbox: string }
    fetchedActivity?: APIEntry & CurrentActivity
  }>,
) => {
  const theme = createTheme()
  const { data: userSettings } = useFetchData<{
    defaultFormat: string
    defaultSport: string
    defaultDate: string
    darkMode: boolean
  }>('/api/userSettings')

  return (
    <ThemeProvider theme={theme}>
      <Provider
        store={GlobalStore.prototype.configureGlobalStore({
          app: {
            ...appInitialState,
            sortCondition: userSettings?.defaultFormat,
            sportCondition: userSettings?.defaultSport,
            dateCondition: userSettings?.defaultDate,
            darkMode: userSettings?.darkMode,
            ...(() => {
              if (props.pageProps.fetchedActivity) {
                return {
                  currentActivity: {
                    ...props.pageProps.fetchedActivity,
                    id: Number(props.pageProps.fetchedActivity.activityId),
                  },
                }
              }
              return {}
            })(),
            clientSideTokens: {
              mapbox: props.pageProps.clientSideTokens?.mapbox || '',
            },
          },
        })}
      >
        <ThemeComponent {...props} initialDarkMode={userSettings?.darkMode} />
      </Provider>
    </ThemeProvider>
  )
}

export default StravaReportGenerator
