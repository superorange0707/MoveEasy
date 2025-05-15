# MoveEasy - UK Address Change Assistant

MoveEasy is a modern web application built with Next.js that helps UK residents manage their address changes when moving to a new home. It provides a streamlined interface for updating addresses across multiple UK service providers, tracking progress, and managing notifications.

## Features

- **UK-Specific Address Management**
  - Postcode lookup functionality for accurate address entry
  - Integration with UK address databases
  - Support for UK address formats

- **Service Provider Integration**
  - Support for major UK utilities (British Gas, Thames Water, etc.)
  - Royal Mail redirection service
  - UK government services (DVLA, Electoral Register, Council Tax)
  - UK financial institutions (HMRC, major UK banks)
  - UK insurance providers

- **Smart Dashboard**
  - Real-time progress tracking
  - Move history
  - Service recommendations
  - Quick actions for common tasks

- **User Settings**
  - Profile management
  - Notification preferences
  - Privacy controls
  - Account security options

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **UI Components**: Custom components with Tailwind
- **Address Lookup**: Integration with UK postcode lookup services

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/moveeasy.git
   cd moveeasy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Add your postcode lookup API key to `.env.local`:
   ```
   POSTCODE_LOOKUP_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
moveeasy/
├── app/                    # Next.js app directory
│   ├── components/         # Reusable components
│   ├── dashboard/         # Dashboard page
│   ├── services/          # Services page
│   ├── settings/          # Settings page
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── public/                # Static assets
├── styles/                # Global styles
├── package.json           # Dependencies and scripts
└── README.md             # Project documentation
```

## Key Components

- **UKAddressLookup**: Postcode-based address lookup component
- **AddressForm**: Multi-step form for address input with postcode lookup
- **ServiceSelection**: UK service provider selection interface
- **ProgressTracker**: Visual progress tracking component
- **ChatInterface**: Real-time chat support interface
- **AccountManagement**: Account settings and security management

## Development

- **Code Style**: The project uses ESLint and Prettier for code formatting
- **Type Safety**: TypeScript is used throughout the project for type safety
- **Component Structure**: Each component is self-contained with its own types and styles
- **State Management**: React hooks for local state, context for global state

## UK Service Providers

The application supports address updates with the following UK service providers:

### Utilities
- British Gas
- Thames Water
- Scottish Power
- BT

### Government
- DVLA (Driver and Vehicle Licensing Agency)
- Electoral Register
- Local Council Services
- NHS

### Financial Services
- HMRC
- Major UK Banks (Lloyds, Barclays, Nationwide)
- Insurance Providers (Aviva, AXA, Direct Line)

### Postal Services
- Royal Mail Redirection
- Parcelforce

## Future Enhancements

- [ ] Integration with more UK service providers
- [ ] Mobile app development
- [ ] AI-powered address verification
- [ ] Automated service provider updates
- [ ] Enhanced analytics and reporting
- [ ] Support for business address changes
- [ ] Integration with UK property databases

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@moveeasy.co.uk or open an issue in the GitHub repository. 