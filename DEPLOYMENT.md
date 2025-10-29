# Deploying to Railway

This guide will help you deploy your Stock Portfolio Tracker to Railway.

## Prerequisites

1. A Railway account (sign up at [railway.app](https://railway.app))
2. Git repository (GitHub, GitLab, or Bitbucket)
3. Your code pushed to the repository

## Deployment Steps

### Option 1: Deploy via Railway Dashboard (Recommended)

1. **Connect to Railway**
   - Go to [railway.app](https://railway.app) and sign in
   - Click "New Project"
   - Select "Deploy from GitHub repo" (or your preferred Git provider)
   - Choose your repository

2. **Configure the Project**
   - Railway will automatically detect this is a Node.js project
   - The build and start commands are already configured in `package.json`
   - No additional configuration needed!

3. **Deploy**
   - Click "Deploy" and Railway will:
     - Install dependencies (`npm ci`)
     - Build the project (`npm run build`)
     - Start the application (`npm run start`)

4. **Access Your App**
   - Once deployed, Railway will provide you with a URL
   - Your app will be live at `https://your-app-name.railway.app`

### Option 2: Deploy via Railway CLI

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize Project**
   ```bash
   railway init
   ```

4. **Deploy**
   ```bash
   railway up
   ```

## Configuration Files

The following files are already configured for Railway deployment:

- `railway.json` - Railway-specific configuration
- `nixpacks.toml` - Build configuration
- `Procfile` - Process definition
- `package.json` - Contains build and start scripts

## Environment Variables

Currently, no environment variables are required. The app uses:
- Local storage for data persistence
- Static build for serving

## Custom Domain (Optional)

1. In your Railway dashboard, go to your project
2. Click on "Settings" → "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Monitoring

Railway provides built-in monitoring:
- View logs in the Railway dashboard
- Monitor resource usage
- Set up alerts for downtime

## Troubleshooting

### Build Issues
- Ensure all dependencies are in `package.json`
- Check that build scripts are correct
- Verify Node.js version compatibility

### Runtime Issues
- Check the logs in Railway dashboard
- Ensure the PORT environment variable is being used
- Verify the start command is correct

### Performance
- The app is optimized for production with:
  - Minified JavaScript and CSS
  - Optimized bundle size
  - Efficient caching headers

## Scaling

Railway automatically handles:
- Load balancing
- Auto-scaling based on traffic
- Health checks
- Zero-downtime deployments

## Cost

Railway offers:
- Free tier with generous limits
- Pay-as-you-scale pricing
- No credit card required for free tier

## Support

- Railway Documentation: [docs.railway.app](https://docs.railway.app)
- Railway Community: [discord.gg/railway](https://discord.gg/railway)
- GitHub Issues: Create an issue in your repository

## Security

Your deployed app includes:
- HTTPS by default
- Secure headers
- No sensitive data in client-side code
- Local storage only (no server-side data)

## Updates

To update your deployed app:
1. Push changes to your repository
2. Railway will automatically detect changes
3. Trigger a new deployment
4. Your app will be updated with zero downtime
