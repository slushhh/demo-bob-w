import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'

import { ConfigProvider, Spin } from 'antd'
import { Provider } from 'react-redux'

import { Routes } from '@/data/routes'
import { ErrorBoundary } from '@/error-boundary'
import { store } from '@/store'
import { AppLayout } from '@/layouts'
import { SettingsContext, settingsContext } from '@/context'

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from 'react-router'

import '@/assets/index.css'

// Lazy page loading
const Home = lazy(() => import('@/pages/home'))
const Rooms = lazy(() => import('@/pages/rooms'))
const Products = lazy(() => import('@/pages/products'))
const Success = lazy(() => import('@/pages/success'))
const About = lazy(() => import('@/pages/about'))
const Error = lazy(() => import('@/pages/error'))

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={<AppLayout />}
      errorElement={
        <Suspense fallback={<Spin size='large' />}>
          <Error />
        </Suspense>
      }
    >
      <Route
        path={Routes.Root}
        element={
          <Suspense fallback={<Spin size='large' />}>
            <Home />
          </Suspense>
        }
      />
      <Route
        path={Routes.Rooms}
        element={
          <Suspense fallback={<Spin size='large' />}>
            <Rooms />
          </Suspense>
        }
      />
      <Route
        path={Routes.Products}
        element={
          <Suspense fallback={<Spin size='large' />}>
            <Products />
          </Suspense>
        }
      />
      <Route
        path={Routes.Success}
        element={
          <Suspense fallback={<Spin size='large' />}>
            <Success />
          </Suspense>
        }
      />
      <Route
        path={Routes.About}
        element={
          <Suspense fallback={<Spin size='large' />}>
            <About />
          </Suspense>
        }
      />
    </Route>,
  ),
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <SettingsContext.Provider value={settingsContext}>
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  // Theme settings by component
                  borderRadius: 0,
                },
                DatePicker: {
                  borderRadius: 0,
                },
                Select: {
                  borderRadius: 0,
                },
              },
              token: {
                // Global theme settings
              },
            }}
          >
            <RouterProvider router={router} />
          </ConfigProvider>
        </SettingsContext.Provider>
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
)
