#!/bin/bash

echo "🚀 Deploying to GitHub..."
echo "Repository: https://github.com/onion2907/cfo2"
echo ""

# Check if repository exists
echo "Checking if repository exists..."
if curl -s -o /dev/null -w "%{http_code}" https://github.com/onion2907/cfo2 | grep -q "200"; then
    echo "✅ Repository exists"
else
    echo "❌ Repository not found. Please create it first:"
    echo "   1. Go to https://github.com/new"
    echo "   2. Repository name: cfo2"
    echo "   3. Description: Stock Portfolio Tracker with Holdings Statement"
    echo "   4. Make it Public"
    echo "   5. Don't initialize with README"
    echo "   6. Click 'Create repository'"
    echo ""
    echo "After creating the repository, run this script again."
    exit 1
fi

echo ""
echo "📤 Pushing code to GitHub..."

# Try HTTPS with token
echo "Attempting HTTPS push..."
git remote set-url origin https://github.com/onion2907/cfo2.git
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo "🌐 Your app will be available at: https://github.com/onion2907/cfo2"
    echo ""
    echo "Next steps:"
    echo "1. Go to https://railway.app/dashboard"
    echo "2. Click 'New Project'"
    echo "3. Select 'Deploy from GitHub repo'"
    echo "4. Choose 'onion2907/cfo2'"
    echo "5. Add environment variable: ALPHA_VANTAGE_API_KEY"
    echo "6. Railway will auto-deploy! 🚀"
else
    echo "❌ Push failed. You may need to authenticate."
    echo ""
    echo "To fix this:"
    echo "1. Get a Personal Access Token from GitHub"
    echo "2. Run: git remote set-url origin https://onion2907:YOUR_TOKEN@github.com/onion2907/cfo2.git"
    echo "3. Run: git push -u origin main"
fi
