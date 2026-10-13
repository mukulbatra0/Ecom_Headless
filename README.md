# E-Commerce Platform

Full-stack e-commerce platform built with Next.js (App Router), WordPress/WooCommerce backend, NextAuth.js authentication, and Razorpay payment integration.

## Technology Stack

- **Frontend**: Next.js 14+ (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: WordPress, WooCommerce
- **Authentication**: NextAuth.js with JWT
- **Payment**: Razorpay
- **Deployment**: Vercel (Next.js), XAMPP/custom hosting (WordPress)

## Project Structure

```
ecom/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with Header & Footer
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles with theme
├── components/             # Reusable React components
│   ├── Header.tsx          # Site header with navigation
│   └── Footer.tsx          # Site footer
├── lib/                    # Utility functions and configurations
│   ├── woocommerce.ts      # WooCommerce API client
│   └── utils/
│       └── formatters.ts   # Formatting utilities
├── public/                 # Static assets
└── .env.local             # Environment variables (not in git)
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- WordPress with WooCommerce installed
- XAMPP or local server for WordPress

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   
   Copy `.env.example` to `.env.local` and update with your values:
   ```env
   NEXT_PUBLIC_WORDPRESS_URL=http://localhost/ecom/server
   WOOCOMMERCE_CONSUMER_KEY=your_consumer_key_here
   WOOCOMMERCE_CONSUMER_SECRET=your_consumer_secret_here
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   ```

3. **Set up WooCommerce API Keys**:
   - Go to WordPress Admin → WooCommerce → Settings → Advanced → REST API
   - Click "Add Key"
   - Set permissions to "Read/Write"
   - Copy the Consumer Key and Consumer Secret to `.env.local`

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Task Progress

- [x] **Task 1**: Project Setup and Migration to Next.js ✅
  - Next.js 14+ with App Router configured
  - Tailwind CSS v4 with custom e-commerce theme
  - Project structure created (components, lib, styles)
  - Header and Footer components built
  - WooCommerce API utility setup
  - Environment variables configured
  - Basic homepage with hero section

- [ ] **Task 2**: WooCommerce Setup and API Connection
- [ ] **Task 3**: Homepage Layout and Featured Products
- [ ] **Task 4**: Product Catalog with Search, Filter, and Sort
- [ ] **Task 5**: Product Detail Page
- (And 20 more tasks...)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features (Coming Soon)

### Customer Features
- Product browsing and search
- Shopping cart with coupon codes
- Secure checkout with multiple payment options
- Customer accounts and order history
- Wishlist functionality
- Product reviews and ratings

### Admin Features (WordPress)
- Product management
- Order management
- Customer management
- Inventory tracking
- Coupon code creation

## Development Notes

- Using Next.js App Router (not Pages Router)
- TypeScript for type safety
- Tailwind CSS v4 for styling
- WooCommerce REST API v3
- Environment variables required for API access

## Next Steps

1. Install and configure WooCommerce in WordPress
2. Generate REST API credentials
3. Create sample products
4. Continue with Task 2: WooCommerce Setup and API Connection

## License

Private project - All rights reserved

## Support

For issues or questions, refer to the task.md file for detailed implementation steps.
