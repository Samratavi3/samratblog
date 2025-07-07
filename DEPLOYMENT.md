# Vercel Deployment Guide for SamBlog

This guide will help you deploy the SamBlog application to Vercel.

## Prerequisites

1. **GitHub Repository**: Ensure your code is pushed to GitHub
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **MongoDB Database**: Have a MongoDB Atlas cluster ready (or other MongoDB instance)

## Step-by-Step Deployment

### 1. Connect GitHub to Vercel

1. Log in to your Vercel dashboard
2. Click **"New Project"**
3. Import your GitHub repository: `samratavi94/samblog`
4. Vercel will automatically detect it's a Next.js project

### 2. Configure Environment Variables

Before deploying, add these environment variables in Vercel:

**In Vercel Dashboard → Your Project → Settings → Environment Variables:**

| Variable Name      | Value                                                                                     | Notes                           |
| ------------------ | ----------------------------------------------------------------------------------------- | ------------------------------- |
| `MONGODB_URI`      | `mongodb+srv://username:password@cluster.mongodb.net/samblog?retryWrites=true&w=majority` | Your MongoDB connection string  |
| `ADMIN_SECRET_KEY` | `your-secure-admin-key-here`                                                              | Choose a strong secret key      |
| `NEXTAUTH_SECRET`  | `your-nextauth-secret-key`                                                                | Generate a secure random string |
| `NEXTAUTH_URL`     | `https://your-app-name.vercel.app`                                                        | Your Vercel app URL             |

### 3. Database Setup (MongoDB Atlas)

If you don't have a MongoDB database set up:

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist Vercel's IP addresses (or use 0.0.0.0/0 for all IPs)
5. Get your connection string
6. Replace `<password>` and `<dbname>` in the connection string

### 4. Deploy

1. Click **"Deploy"** in Vercel
2. Wait for the build to complete
3. Your app will be available at `https://your-app-name.vercel.app`

## Post-Deployment Steps

### 1. Update NEXTAUTH_URL

After deployment, update the `NEXTAUTH_URL` environment variable with your actual Vercel URL.

### 2. Test Your Application

- Visit your deployed app
- Test blog creation at `/getstart`
- Test admin panel at `/admin`
- Verify database connectivity

### 3. Custom Domain (Optional)

In Vercel dashboard, you can add a custom domain:

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update `NEXTAUTH_URL` to your custom domain

## Automatic Deployments

Once connected, Vercel will automatically deploy:

- **Every push to main branch** → Production deployment
- **Every push to other branches** → Preview deployment

## Environment Variables Reference

```bash
# Production Environment Variables for Vercel

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/samblog?retryWrites=true&w=majority

# Authentication
ADMIN_SECRET_KEY=your-super-secure-admin-key-change-this-in-production
NEXTAUTH_SECRET=your-nextauth-secret-key-32-characters-long
NEXTAUTH_URL=https://samblog.vercel.app

```

## Troubleshooting

### Build Errors

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set correctly

### Database Connection Issues

- Verify MongoDB URI is correct
- Check if your MongoDB cluster allows connections from 0.0.0.0/0
- Ensure database user has proper permissions

### API Routes Not Working

- Check function logs in Vercel dashboard
- Verify API routes are in the correct directory structure
- Ensure environment variables are available to serverless functions

## Performance Optimization

Your app is already optimized for Vercel with:

- ✅ Next.js Image optimization
- ✅ Sharp for image processing
- ✅ Compression enabled
- ✅ Security headers configured
- ✅ API route caching configured

## Monitoring

Monitor your deployment:

- **Vercel Analytics**: Built-in analytics
- **Function Logs**: Debug API issues
- **Performance Insights**: Monitor loading times

## Support

If you encounter issues:

1. Check Vercel's deployment logs
2. Review this deployment guide
3. Check the main README.md for general troubleshooting

---

**🚀 Happy Deploying!**
