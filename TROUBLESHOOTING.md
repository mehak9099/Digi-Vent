# Digi-Vent Troubleshooting Guide

## 🚨 Common Issues & Solutions

### Authentication Issues

#### Problem: Buttons showing loading state on page load
**Symptoms:**
- Login/signup buttons appear disabled immediately
- Loading spinner shows without user interaction
- Happens before any clicks

**Root Cause:** 
Mixing `isLoading` (auth initialization) with `isSubmitting` (form submission) states.

**Solution:**
```typescript
// ❌ Wrong - mixing loading states
disabled={isSubmitting || isLoading}

// ✅ Correct - separate concerns
disabled={isSubmitting}
```

**Status:** ✅ Fixed in latest version

#### Problem: Login spinner keeps loading indefinitely
**Symptoms:**
- User enters credentials and clicks login
- Spinner shows "Signing In..." but never completes
- No navigation to dashboard occurs
- User gets stuck on login page

**Root Cause:** 
Navigation logic conflicts between auth state changes and manual navigation calls.

**Solution:**
```typescript
// ✅ Correct - Navigation in auth hook after profile fetch
const fetchProfile = async (userId: string) => {
  // ... fetch profile logic
  
  // Only navigate from auth pages
  const currentPath = window.location.pathname;
  if (currentPath === '/login' || currentPath === '/auth') {
    if (data.role === 'admin' || data.role === 'organizer') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard/volunteer');
    }
  }
};
```

**Status:** ✅ Fixed in latest version

#### Problem: 403 errors after successful login
**Symptoms:**
- User logs in successfully
- Redirected to 403 forbidden page
- User has correct credentials

**Solutions:**
1. **Check user role in database**
2. **Verify RLS policies**
3. **Clear browser cache and cookies**
4. **Check Supabase logs**

#### Problem: Email confirmation redirects to localhost
**Symptoms:**
- Email confirmation links point to localhost:3000
- Links don't work on mobile/different devices

**Solution:**
Update Supabase settings:
1. Go to Authentication > Settings
2. Set Site URL to your actual domain
3. Update email templates

### Database Issues

#### Problem: RLS policies blocking legitimate access
**Symptoms:**
- Users can't access their own data
- Admin can't manage resources
- Database queries fail silently

**Solutions:**
1. **Check policy syntax:**
   ```sql
   -- Ensure policies are properly formatted
   CREATE POLICY "Users can read own data"
   ON profiles FOR SELECT
   TO authenticated
   USING (auth.uid() = id);
   ```

2. **Test policies in SQL editor:**
   ```sql
   -- Test as specific user
   SELECT * FROM profiles WHERE id = auth.uid();
   ```

#### Problem: Migration errors
**Symptoms:**
- SQL migration fails to run
- Tables not created properly
- Foreign key constraints fail

**Solutions:**
1. **Check migration order**
2. **Verify table dependencies**
3. **Run migrations one by one**
4. **Check for syntax errors**

### Frontend Issues

#### Problem: Components not rendering
**Symptoms:**
- Blank pages or components
- Console errors about missing props
- TypeScript errors

**Solutions:**
1. **Check TypeScript errors:**
   ```bash
   npm run build
   ```

2. **Verify imports:**
   ```typescript
   // Ensure all imports are correct
   import { Component } from './path/to/component';
   ```

3. **Check prop types:**
   ```typescript
   interface Props {
     requiredProp: string;
     optionalProp?: number;
   }
   ```

#### Problem: Routing issues
**Symptoms:**
- 404 errors on refresh
- Routes not working after deployment
- Navigation not functioning

**Solutions:**
1. **Add redirect rules for SPA:**
   ```
   /*    /index.html   200
   ```

2. **Check route definitions:**
   ```typescript
   <Route path="/admin/*" element={<ProtectedRoute />} />
   ```

### Performance Issues

#### Problem: Slow loading times
**Symptoms:**
- Pages take >3s to load
- Large bundle sizes
- Poor Lighthouse scores

**Solutions:**
1. **Enable code splitting:**
   ```typescript
   const LazyComponent = lazy(() => import('./Component'));
   ```

2. **Optimize images:**
   - Use WebP format
   - Implement lazy loading
   - Compress images

3. **Bundle analysis:**
   ```bash
   npm run build -- --analyze
   ```

### Deployment Issues

#### Problem: Build failures
**Symptoms:**
- npm run build fails
- TypeScript compilation errors
- Missing dependencies

**Solutions:**
1. **Clear cache:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Fix TypeScript errors:**
   ```bash
   npx tsc --noEmit
   ```

3. **Check dependencies:**
   ```bash
   npm audit fix
   ```

#### Problem: Environment variables not working
**Symptoms:**
- Supabase connection fails in production
- Features not working as expected
- Console errors about missing variables

**Solutions:**
1. **Verify variable names:**
   ```env
   # Must start with VITE_ for Vite
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_ANON_KEY=your_key
   ```

2. **Check deployment platform settings**
3. **Restart build after adding variables**

## 🔧 Debugging Tools

### Browser Developer Tools
1. **Console:** Check for JavaScript errors
2. **Network:** Monitor API calls and responses
3. **Application:** Check localStorage and cookies
4. **Performance:** Analyze loading times

### Supabase Dashboard
1. **Logs:** Check real-time logs for errors
2. **Auth:** Monitor user sessions and signups
3. **Database:** Query data directly
4. **API:** Test endpoints manually

### Development Tools
```bash
# Check TypeScript errors
npx tsc --noEmit

# Lint code
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📞 Getting Help

### Self-Help Resources
1. **Check this troubleshooting guide**
2. **Review browser console errors**
3. **Check Supabase dashboard logs**
4. **Test in incognito/private mode**

### Documentation
- `README.md` - General setup and features
- `SETUP_GUIDE.md` - Detailed setup instructions
- `DEPLOYMENT_CHECKLIST.md` - Deployment guide

### Support Channels
- **GitHub Issues:** For bugs and feature requests
- **Email:** support@digi-vent.com
- **Documentation:** Check inline code comments

## 🎯 Prevention Tips

### Code Quality
- Use TypeScript strictly
- Implement proper error boundaries
- Add comprehensive testing
- Follow React best practices

### Security
- Never commit environment variables
- Regularly update dependencies
- Test RLS policies thoroughly
- Implement proper input validation

### Performance
- Monitor bundle size
- Implement lazy loading
- Optimize images and assets
- Use React.memo for expensive components

### Deployment
- Test in staging environment first
- Use CI/CD pipelines
- Monitor application after deployment
- Have rollback plan ready

---

**Last Updated:** January 2025
**Version:** 1.0.0
**Status:** Production Ready ✅