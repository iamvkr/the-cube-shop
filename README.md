# 🛒The Cube Shop 

### Interactive Shopping Store Management Game

A shopping simulator built with React where you play as a shopkeeper managing inventory, serving customers, and maximizing profits through strategic pricing and timing.

![React](https://img.shields.io/badge/react-19.x-blue)
![TypeScript](https://img.shields.io/badge/typescript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-4.x-blue)
![Zustand](https://img.shields.io/badge/zustand-5.x-orange)

## 🎮 Game Overview

Run your own shop! Purchase products, set prices strategically, serve customers within time limits, and upgrade your profit margins through timed mechanics. Balance pricing strategy with customer satisfaction to build your coin reserves.

### Core Gameplay
1. **Purchase Products** - Buy inventory from the catalog
2. **Set Prices** - Adjust selling prices within profit margin caps
3. **Serve Customers** - Process orders before patience runs out
4. **Upgrade Margins** - Unlock higher profit caps through timed upgrades
5. **Restock Inventory** - Keep shelves stocked to avoid missed sales

---

## ✨ Key Features

### 📦 Inventory Management
- **Add Products**: Purchase from a catalog of 6 different products with varying rarities (common, uncommon, rare)
- **Dynamic Pricing**: Set custom prices with profit margin caps (starting at 50%)
- **Stock Tracking**: Monitor inventory levels and restock when needed
- **Visual Indicators**: Color-coded alerts for low stock (≤10) and out-of-stock items

### 👥 Smart Customer System
- **Intelligent Shopping Lists**: Customers generate 1-3 items
- **Patience Mechanic**: Each customer has their own Patience time - complete orders or lose the sale
- **No Stock Orders**: Customers only request items that are in stock

### 💰 Billing & Memory Challenge
- **Memory Challenge**: Player must memorize customer's order and bill correctly
- **Exact Match Validation**: Orders must match customer requests exactly (items + quantities)
- **Instant Feedback**: 
  - Success: Earn coins, inventory reduced
  - Failure: Customer leaves, no sale

### 📈 Profit Upgrade System
- **Variable Increments**: Choose upgrade percentage (10%, 20%, 30%, 40%, 50%)
- **Dynamic Costs**: Bulk increments cost less coins
- **Timed Unlocks**: Wait for timer completion
- **Strategic Depth**: Balance upgrade costs vs potential profit gains

### 🎯 Restocking System
- **Unified Catalog View**: Add new products or restock existing ones from same modal
- **Smart Button States**:
  - "Add to Inventory" for new products
  - "Buy More Stock" for items with stock
  - "Restock Now" for out-of-stock items
- **Visual Stock Indicators**: Color-coded borders and stock displays

---

## 🎮 Play Now

Play Now Live at  - [`thecubeshop.appwrite.network`](http://thecubeshop.appwrite.network/)

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework with functional components and hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling

### State Management
- **Zustand** - Lightweight state management
  - Centralized game store
  - Actions for all game operations
  - Potential for persistence middleware

### Icons & UI
- **[Pixelart Icons](https://pixelarticons.com/)** - Beautiful icon library
- **[Pixalated Retro UI](https://retroui.io/)** - A simple pixelated UI library.

---

## 📂 Project Structure

```
src/
├── App.tsx                 # Main game view with action buttons
├── appwrite/                 # Appwrite configs and services
├── zustannd/store.ts         # Zustand store (state + actions)
├── components/               # Components like inventory, upgrade, billing, customer Modals etc
├── pages/
│   ├── Home.tsx              # Landing page
│   ├── Start.tsx             # Login/Signup Management
│   ├── Shop.tsx              # Shop Management Page
└── data.ts                   # Product cateloge templates
└── utils.ts                  # utility functions
└── playSounds.ts             # play sounds functions
└── types.ts                  # type definations
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- pnpm, npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/iamvkr/the-cube-shop.git
cd the-cube-shop

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

### Build for Production

```bash
pnpm run build
```

---

## 🎯 Gameplay Tips

### Pricing Strategy
- **Loss Leaders**: Price some items at low margins (10-20%) to attract customers
- **Premium Items**: High-margin items (80-100%) for max profit when sold
- **Sweet Spot**: 30-50% margins balance volume and profit
- **Monitor Trends**: If items aren't selling, lower prices

### Time Management
- Upgrade profit margins during slow periods
- Process orders quickly to serve more customers
- Restock before running out to avoid missed sales

### Upgrade Strategy
- Start with small increments (10-20%) for quick wins
- Save coins for larger upgrades (40-50%) on best-selling items
- Prioritize upgrades on low-margin products first

### Memory Challenge Tips
- Focus on item names and quantities
- Use associations (e.g., "3 apples, 2 milk" = "3 fruits, 2 dairy")
- Build cart systematically (same order as customer listed)

---

## 🔮 Future Enhancements

### Planned Features
- [ ] **Order History**: Track completed sales and statistics
- [ ] **Difficulty Levels**: Easy (hints), Normal (current), Hard (faster timers)
- [ ] **Achievement System**: Unlock badges for milestones
- [ ] **More Products**: Expand catalog to 15-20 items
- [ ] **Customer Types**: VIP customers, bulk buyers, bargain hunters
- [ ] **Shop Upgrades**: Increase customer spawn rate, longer patience timers
- [ ] **Analytics Dashboard**: Sales trends, best-selling products, profit charts
- [ ] **Sound Effects**: Audio feedback for sales, failures, upgrades
- [ ] **Leaderboard**: Compare scores with other players

### Advanced Mechanics
- [ ] **Spoilage System**: Perishable items expire over time
- [ ] **Seasonal Events**: Holiday sales, special promotions
- [ ] **Competitor Pricing**: AI shops affect your customer flow
- [ ] **Employee System**: Hire staff to automate restocking/billing
- [ ] **Shop Expansion**: Unlock new product categories

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for type safety
- Follow functional component patterns
- Keep components modular and reusable
- Add comments for complex logic
- Test game mechanics thoroughly

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Iamvkr**
- GitHub: [@iamvkr](https://github.com/iamvkr)
---

## 🙏 Acknowledgments

- Built with guidance from Claude (Anthropic)
- Inspired by classic shop management games
- Icons by [Pixelart Icons](https://pixelarticons.com/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com)
- UI library: [Pixalated Retro UI](https://retroui.io/)- A simple pixelated UI library.
- Pixel art Person: https://btl-games.itch.io/
- Sound Effects
    * [Matthew Vakalyuk](https://pixabay.com/users/matthewvakaliuk73627-48347364/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=290204) from [Pixabay](https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=290204)
    * [LIECIO](https://pixabay.com/users/liecio-3298866/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=190037) from [Pixabay](https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=190037)
    * [Universfield](https://pixabay.com/users/universfield-28281460/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=323603) from [Pixabay](https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=323603)
    * [Sarah H](https://pixabay.com/users/astralsynthesizer-50776509/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=358765) from [Pixabay](https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=358765)
- BGM:
    * [Youtube](https://www.youtube.com/watch?v=OO2kPK5-qno)
---

**Enjoy running your shop! 🏪**