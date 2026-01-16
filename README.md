# NAVA/MIYA - Water Delivery & Management Platform

A comprehensive full-stack application for water tank management, delivery tracking, maintenance services, and fleet operations.

## Platform Overview

NAVA/MIYA is designed for the Saudi Arabian market, facilitating:
- **Homeowners**: Manage water tanks, track consumption, order refills, and schedule maintenance
- **Drivers**: Accept deliveries, track routes, manage earnings, and collect payments
- **Technicians**: Accept maintenance jobs, complete services, and manage warranties
- **Fleet Managers**: Oversee drivers, optimize routes, manage fleet, and analyze performance
- **Admins**: System configuration, user management, compliance, and analytics

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io

### Frontend
- **Library**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Charts**: Chart.js & React-ChartJS-2

## Project Structure

```
Serene-2/
├── backend/
│   ├── models/              # MongoDB schemas
│   │   ├── User.js
│   │   ├── Tank.js
│   │   ├── Order.js
│   │   ├── MaintenanceRequest.js
│   │   ├── Wallet.js
│   │   └── Notification.js
│   ├── controllers/         # Business logic
│   │   ├── authController.js
│   │   ├── tankController.js
│   │   ├── orderController.js
│   │   └── maintenanceController.js
│   ├── routes/              # API endpoints
│   │   ├── authRoutes.js
│   │   ├── tankRoutes.js
│   │   ├── orderRoutes.js
│   │   └── maintenanceRoutes.js
│   ├── middleware/          # Express middleware
│   │   └── auth.js          # JWT authentication
│   ├── config/              # Configuration
│   └── server.js            # Entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── Navigation.js
│   │   │   └── TankCard.js
│   │   ├── pages/           # Page components
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── HomeownerDashboard.js
│   │   │   ├── DriverDashboard.js
│   │   │   └── OrderRefill.js
│   │   ├── context/         # React Context
│   │   │   └── AuthContext.js
│   │   ├── services/        # API services
│   │   │   └── api.js
│   │   ├── styles/          # CSS files
│   │   │   ├── index.css
│   │   │   ├── auth.css
│   │   │   ├── dashboard.css
│   │   │   └── components.css
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── .env                     # Environment variables
├── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment variables** - Create/update `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/nava_miya
JWT_SECRET=your_secret_key
JWT_EXPIRY=7d
PORT=5000
NODE_ENV=development
```

3. **Start MongoDB**:
```bash
# If using local MongoDB
mongod
```

4. **Run backend server**:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Install dependencies**:
```bash
cd frontend
npm install
```

2. **Start development server**:
```bash
npm start
```

The frontend will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/resend-otp` - Resend OTP
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Tanks
- `GET /api/tanks` - Get all user tanks
- `POST /api/tanks` - Add new tank
- `GET /api/tanks/:id` - Get tank details
- `PUT /api/tanks/:id` - Update tank
- `DELETE /api/tanks/:id` - Delete tank
- `POST /api/tanks/:id/calibrate` - Calibrate sensor
- `POST /api/tanks/:id/pair-sensor` - Pair IoT sensor
- `GET /api/tanks/dashboard-summary` - Get dashboard stats

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `POST /api/orders/:id/accept` - Accept order (driver)
- `PUT /api/orders/:id/status` - Update order status
- `POST /api/orders/:id/complete` - Complete delivery
- `POST /api/orders/:id/rate` - Rate service
- `POST /api/orders/:id/cancel` - Cancel order

### Maintenance
- `GET /api/maintenance` - Get maintenance requests
- `POST /api/maintenance` - Create request
- `GET /api/maintenance/:id` - Get request details
- `POST /api/maintenance/:id/accept` - Accept job (technician)
- `POST /api/maintenance/:id/complete` - Complete job
- `POST /api/maintenance/:id/rate` - Rate service
- `GET /api/maintenance/technician/jobs` - Get technician jobs

## Key Features

### Homeowner Features
✅ Tank management and real-time monitoring
✅ Water consumption tracking
✅ Automated low-level alerts
✅ Quick refill ordering
✅ Order tracking and delivery confirmation
✅ Maintenance request scheduling
✅ Usage analytics and reports
✅ Payment wallet integration

### Driver Features
✅ Real-time order notifications
✅ Route optimization
✅ GPS tracking
✅ Proof of delivery (photos)
✅ Payment tracking
✅ Customer ratings
✅ Earnings dashboard

### Technician Features
✅ Job assignment notifications
✅ Service scheduling
✅ Work documentation (photos, notes)
✅ Warranty management
✅ Rating system
✅ Earnings tracking

### Manager Features
✅ Driver management
✅ Real-time order dispatch
✅ Route optimization
✅ Performance analytics
✅ Financial reporting
✅ Complaint management

### Admin Features
✅ User management
✅ System configuration
✅ Financial reconciliation
✅ Compliance monitoring
✅ Analytics and reporting
✅ IoT sensor management

## Authentication Flow

1. **Registration**: User creates account with phone/email
2. **OTP Verification**: System sends 6-digit OTP
3. **Account Activation**: User verifies OTP
4. **JWT Token**: System generates JWT token
5. **Protected Routes**: All subsequent requests include JWT in Authorization header

## User Roles

| Role | Permissions |
|------|-------------|
| `homeowner` | Create tanks, order refills, request maintenance |
| `driver` | Accept orders, update delivery status, complete orders |
| `technician` | Accept jobs, complete maintenance, submit work |
| `fleet_manager` | Manage drivers, dispatch orders, view analytics |
| `admin` | Full system access, user management, compliance |

## Database Models

### User
- Basic user information
- Role and status
- Notification preferences
- Verification details

### Tank
- Homeowner association
- Sensor information
- Calibration data
- Current level and capacity
- Maintenance history

### Order
- Customer and driver tracking
- Pricing breakdown
- Payment details
- Real-time tracking updates
- Delivery proof

### MaintenanceRequest
- Service type and priority
- Technician assignment
- Work completion details
- Cost and warranty

### Wallet
- Balance tracking
- Transaction history
- Withdrawal requests
- Auto-recharge settings

### Notification
- Multi-channel delivery (push, SMS, email, in-app)
- Status tracking
- Auto-expiration

## Security Features

✅ Password hashing with bcryptjs
✅ JWT-based authentication
✅ Role-based access control
✅ PCI-DSS compliance ready
✅ GDPR data protection
✅ Input validation and sanitization
✅ CORS protection
✅ Rate limiting (ready to implement)

## Error Handling

The application includes comprehensive error handling:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

All errors return structured JSON responses with descriptive messages.

## Future Enhancements

- [ ] Real-time socket.io integration for live tracking
- [ ] Automated email/SMS notifications
- [ ] Advanced analytics with AWS QuickSight
- [ ] Mobile app (React Native)
- [ ] Payment gateway integration (Stripe, STC Pay)
- [ ] Biometric authentication
- [ ] IoT sensor API integration
- [ ] Predictive analytics for demand forecasting
- [ ] Multi-language support (AR/EN)
- [ ] Subscription tiers and premium features

## Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@navamiya.com or contact the development team.

## Roadmap

### Phase 1 (Current)
- Core functionality for all user types
- Basic order management
- Maintenance tracking

### Phase 2
- Real-time tracking with Socket.io
- Advanced analytics
- Payment gateway integration
- Mobile app development

### Phase 3
- AI-powered recommendations
- Predictive maintenance
- Supply chain optimization
- B2B integrations

---

**Status**: Development
**Last Updated**: November 2024
**Version**: 1.0.0
