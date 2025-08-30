// src/App.tsx - Updated to use AppLayout
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppLayout } from './components/layout';

// Import auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Import main pages
import Dashboard from './pages/dashboard/Dashboard';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes with layout */}
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            {/* Placeholder routes for other pages */}
            <Route path="/transactions" element={
              <ProtectedRoute>
                <AppLayout>
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
                    <p className="text-gray-600 mt-2">Coming soon...</p>
                  </div>
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/portfolio" element={
              <ProtectedRoute>
                <AppLayout>
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
                    <p className="text-gray-600 mt-2">Coming soon...</p>
                  </div>
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/reports" element={
              <ProtectedRoute>
                <AppLayout>
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                    <p className="text-gray-600 mt-2">Coming soon...</p>
                  </div>
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/upload" element={
              <ProtectedRoute>
                <AppLayout>
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-gray-900">Upload Data</h1>
                    <p className="text-gray-600 mt-2">Coming soon...</p>
                  </div>
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <AppLayout>
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                    <p className="text-gray-600 mt-2">Coming soon...</p>
                  </div>
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <AppLayout>
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600 mt-2">Coming soon...</p>
                  </div>
                </AppLayout>
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;





















// // src/App.tsx - Updated to include AuthProvider
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { AuthProvider } from './contexts/AuthContext';
// import { ProtectedRoute } from './components/auth/ProtectedRoute';

// // Import pages (we'll create these next)
// import LoginPage from './pages/auth/LoginPage';
// import RegisterPage from './pages/auth/RegisterPage';
// import Dashboard from './pages/Dashboard';
// import { AppLayout } from './components/layout/AppLayout';

// // Create a client for React Query
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: 1,
//       refetchOnWindowFocus: false,
//     },
//   },
// });

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <AuthProvider>
//         <Router>
//           <div className="App">
//             <Routes>
//               {/* Public routes */}
//               <Route path="/login" element={<LoginPage />} />
//               <Route path="/register" element={<RegisterPage />} />
              
//               {/* Protected routes */}
//               <Route path="/" element={
//                 <ProtectedRoute>
//                   <AppLayout>
//                     <Dashboard />
//                   </AppLayout>
//                 </ProtectedRoute>
//               } />
              
//               {/* Additional protected routes will go here */}
//               <Route path="/transactions/*" element={
//                 <ProtectedRoute>
//                   <AppLayout>
//                     <div>Transactions (Coming Soon)</div>
//                   </AppLayout>
//                 </ProtectedRoute>
//               } />
              
//               <Route path="/portfolio" element={
//                 <ProtectedRoute>
//                   <AppLayout>
//                     <div>Portfolio (Coming Soon)</div>
//                   </AppLayout>
//                 </ProtectedRoute>
//               } />
              
//               <Route path="/reports" element={
//                 <ProtectedRoute>
//                   <AppLayout>
//                     <div>Reports (Coming Soon)</div>
//                   </AppLayout>
//                 </ProtectedRoute>
//               } />
              
//               <Route path="/upload" element={
//                 <ProtectedRoute>
//                   <AppLayout>
//                     <div>Upload (Coming Soon)</div>
//                   </AppLayout>
//                 </ProtectedRoute>
//               } />
              
//               <Route path="/profile" element={
//                 <ProtectedRoute>
//                   <AppLayout>
//                     <div>Profile (Coming Soon)</div>
//                   </AppLayout>
//                 </ProtectedRoute>
//               } />
              
//               <Route path="/settings" element={
//                 <ProtectedRoute>
//                   <AppLayout>
//                     <div>Settings (Coming Soon)</div>
//                   </AppLayout>
//                 </ProtectedRoute>
//               } />
              
//               {/* Catch all route */}
//               <Route path="*" element={<Navigate to="/" replace />} />
//             </Routes>
//           </div>
//         </Router>
//       </AuthProvider>
//     </QueryClientProvider>
//   );
// }

// export default App;




// // import React from 'react';
// // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// // import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// // import { AuthProvider } from './contexts/AuthContext';
// // import { ProtectedRoute } from './components/auth/ProtectedRoute';
// // import { AuthTest } from './components/test/AuthTest';
// // import LoginPage from './pages/auth/LoginPage';
// // import RegisterPage from './pages/auth/RegisterPage';

// // const queryClient = new QueryClient({
// //   defaultOptions: {
// //     queries: {
// //       retry: 1,
// //       refetchOnWindowFocus: false,
// //     },
// //   },
// // });

// // function App() {
// //   return (
// //     <QueryClientProvider client={queryClient}>
// //       <AuthProvider>
// //         <Router>
// //           <Routes>
// //             <Route path="/login" element={<LoginPage />} />
// //             <Route path="/register" element={<RegisterPage />} />
// //             <Route path="/" element={
// //               <ProtectedRoute>
// //                 <AuthTest />
// //               </ProtectedRoute>
// //             } />
// //             <Route path="*" element={<Navigate to="/" replace />} />
// //           </Routes>
// //         </Router>
// //       </AuthProvider>
// //     </QueryClientProvider>
// //   );
// // }

// // export default App;
