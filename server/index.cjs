const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('./generated/prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const Database = require('better-sqlite3');
require('dotenv').config();

const app = express();
const db = new Database('./dev.db');
const adapter = new PrismaBetterSqlite3(db);
const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Middleware to simulate authentication ---
// In a real app, this would verify a JWT or session token.
// Here we expect a `x-merchant-id` header for simplicity in this prototype.
const requireAuth = (req, res, next) => {
  const merchantId = req.headers['x-merchant-id'];
  if (!merchantId) return res.status(401).json({ error: 'Unauthorized' });
  req.merchantId = merchantId;
  next();
};

// --- AUTH & MERCHANT APIs ---

// Simulated OAuth Login
app.post('/api/auth/login', async (req, res) => {
  const { shopDomain, shopName, email } = req.body;
  try {
    let merchant = await prisma.merchant.findUnique({
      where: { shopDomain }
    });

    if (!merchant) {
      // First install: Create merchant, default subscription, and settings
      merchant = await prisma.merchant.create({
        data: {
          shopDomain,
          shopName,
          email,
          merchantName: shopName,
          subscription: { create: { plan: 'Free' } },
          settings: { create: { storeEmail: email } }
        },
        include: { subscription: true }
      });
    } else {
      // Update last login
      merchant = await prisma.merchant.update({
        where: { id: merchant.id },
        data: { lastLogin: new Date() },
        include: { subscription: true }
      });
    }

    res.json(merchant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to authenticate' });
  }
});

// Get Profile
app.get('/api/merchant/profile', requireAuth, async (req, res) => {
  try {
    const profile = await prisma.merchant.findUnique({
      where: { id: req.merchantId },
      include: { subscription: true, settings: true }
    });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update Profile
app.put('/api/merchant/profile', requireAuth, async (req, res) => {
  try {
    const updated = await prisma.merchant.update({
      where: { id: req.merchantId },
      data: req.body
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// --- SUBSCRIPTION APIs ---

app.put('/api/subscription', requireAuth, async (req, res) => {
  const { plan } = req.body; // Free, Standard, Pro
  try {
    const subscription = await prisma.subscription.update({
      where: { merchantId: req.merchantId },
      data: { plan }
    });
    
    // Add to billing history
    await prisma.billingHistory.create({
      data: {
        merchantId: req.merchantId,
        plan,
        amount: plan === 'Pro' ? 19.99 : plan === 'Standard' ? 9.99 : 0,
        status: 'Paid'
      }
    });

    // If downgrading to Free, we should ideally disable extra active announcements, 
    // but for this prototype we'll let the user manage it or enforce it on the frontend.

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update subscription' });
  }
});

// --- ANNOUNCEMENT APIs ---

app.get('/api/announcements', requireAuth, async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({
      where: { merchantId: req.merchantId },
      include: { analytics: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

app.post('/api/announcements', requireAuth, async (req, res) => {
  try {
    const sub = await prisma.subscription.findUnique({ where: { merchantId: req.merchantId } });
    
    // Feature gating check (e.g. Free plan = max 1 active)
    if (req.body.status === 'Active' && sub.plan === 'Free') {
      const activeCount = await prisma.announcement.count({
        where: { merchantId: req.merchantId, status: 'Active' }
      });
      if (activeCount >= 1) {
        return res.status(403).json({ error: 'Free plan allows only 1 active announcement.' });
      }
    }

    const announcement = await prisma.announcement.create({
      data: {
        ...req.body,
        merchantId: req.merchantId,
        analytics: { create: { views: 0, clicks: 0, ctr: 0 } }
      },
      include: { analytics: true }
    });
    res.json(announcement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

app.put('/api/announcements/:id', requireAuth, async (req, res) => {
  try {
    const updated = await prisma.announcement.update({
      where: { id: req.params.id, merchantId: req.merchantId },
      data: req.body,
      include: { analytics: true }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update announcement' });
  }
});

app.delete('/api/announcements/:id', requireAuth, async (req, res) => {
  try {
    await prisma.announcement.delete({
      where: { id: req.params.id, merchantId: req.merchantId }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

app.post('/api/announcements/:id/duplicate', requireAuth, async (req, res) => {
  try {
    const original = await prisma.announcement.findUnique({
      where: { id: req.params.id, merchantId: req.merchantId }
    });
    if (!original) return res.status(404).json({ error: 'Not found' });
    
    const { id, createdAt, updatedAt, ...copyData } = original;
    copyData.name = `${copyData.name} (Copy)`;
    copyData.status = 'Draft';

    const duplicate = await prisma.announcement.create({
      data: {
        ...copyData,
        analytics: { create: { views: 0, clicks: 0, ctr: 0 } }
      },
      include: { analytics: true }
    });
    res.json(duplicate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to duplicate announcement' });
  }
});

// --- ANALYTICS ---

app.get('/api/analytics', requireAuth, async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({
      where: { merchantId: req.merchantId },
      include: { analytics: true }
    });
    
    let totalViews = 0;
    let totalClicks = 0;
    
    announcements.forEach(a => {
      if (a.analytics) {
        totalViews += a.analytics.views;
        totalClicks += a.analytics.clicks;
      }
    });

    const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0;
    
    // Mock daily data for charts
    const chartData = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        views: Math.floor(Math.random() * (totalViews / 7 || 100)),
        clicks: Math.floor(Math.random() * (totalClicks / 7 || 10))
      };
    });

    res.json({ totalViews, totalClicks, ctr, chartData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// --- STOREFRONT PUBLIC API ---

app.get('/api/storefront/active-banner/:shopDomain', async (req, res) => {
  try {
    const merchant = await prisma.merchant.findUnique({
      where: { shopDomain: req.params.shopDomain }
    });
    if (!merchant) return res.status(404).json({ error: 'Store not found' });

    // Fetch active announcements (could be multiple if Pro/Standard, but let's just return all active)
    const activeBanners = await prisma.announcement.findMany({
      where: { merchantId: merchant.id, status: 'Active' },
      select: {
        id: true,
        message: true,
        buttonText: true,
        customUrl: true,
        bgColor: true,
        textColor: true,
        btnColor: true,
        position: true,
        fontFamily: true,
        roundedCorners: true,
        shadows: true,
        gradientBg: true,
        glowEffect: true,
        animation: true,
        countdown: true
      }
    });

    res.json({ banners: activeBanners });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch storefront banner' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
