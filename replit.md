# Overview

This is a modern portfolio website for Mark Raevski, a technical and environment artist. The application features a sophisticated, minimalist design with an interactive command-line style intro animation, followed by a main portfolio showcase with sections for About, Portfolio Gallery, and Contact information. The site is built as a full-stack web application with both client and server components, designed to present Mark's expertise in tools like Unreal Engine, Houdini, Blender, and Substance Painter.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built with React and TypeScript, utilizing a modern component-based architecture:
- **Framework**: React with Vite as the build tool and development server
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn/ui component library with Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom CSS variables for theming, including dark mode support
- **Animations**: Framer Motion for smooth page transitions and interactive elements
- **State Management**: TanStack Query for server state management and API caching
- **Form Handling**: React Hook Form with Zod validation resolvers

## Backend Architecture
The server follows a REST API pattern built on Express.js:
- **Framework**: Express.js with TypeScript for type safety
- **Architecture Pattern**: RESTful API with route-based organization
- **Development Setup**: Hot reloading with Vite integration for seamless development experience
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Logging**: Request/response logging middleware for API monitoring

## Data Storage Solutions
The application uses a hybrid approach for data management:
- **Database**: PostgreSQL configured with Drizzle ORM for type-safe database interactions
- **Schema Management**: Drizzle Kit for database migrations and schema management
- **In-Memory Storage**: Fallback memory storage implementation for development and testing
- **Static Data**: Project portfolio data stored as TypeScript constants in shared schema

## Authentication and Authorization
Currently implements a basic user management system:
- **User Storage**: Abstract storage interface allowing for multiple storage backends
- **Session Management**: Prepared for PostgreSQL session storage with connect-pg-simple
- **User Operations**: CRUD operations for user management (create, read by ID/username)

## Project Structure
- **Monorepo Structure**: Client, server, and shared code organized in separate directories
- **Shared Schema**: Common data types and validation schemas shared between client and server
- **Asset Management**: External assets stored in attached_assets directory
- **Component Organization**: UI components organized by functionality with proper separation of concerns

The architecture prioritizes developer experience with hot reloading, type safety throughout the stack, and a clear separation of concerns between client and server code.

# External Dependencies

## Database and ORM
- **Neon Database**: PostgreSQL hosting service via @neondatabase/serverless
- **Drizzle ORM**: Type-safe database toolkit for PostgreSQL interactions
- **Drizzle Zod**: Integration between Drizzle ORM and Zod for schema validation

## Frontend UI and Animation
- **Radix UI**: Comprehensive set of accessible UI primitives for building the component system
- **Framer Motion**: Animation library for smooth page transitions and interactive elements
- **Embla Carousel**: Carousel component for potential image galleries
- **Lucide React**: Icon library for consistent iconography

## Development and Build Tools
- **Vite**: Fast build tool and development server with React plugin
- **Replit Integration**: Development environment integration with runtime error overlay and cartographer
- **ESBuild**: JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer

## Styling and Theming
- **Tailwind CSS**: Utility-first CSS framework with custom theme configuration
- **Class Variance Authority**: Utility for creating variant-based component APIs
- **CLSX**: Conditional className utility for dynamic styling

## HTTP and API Management
- **TanStack React Query**: Data fetching and caching library for API state management
- **Express.js**: Web server framework for REST API endpoints
- **Session Management**: Connect-pg-simple for PostgreSQL-based session storage

## Utilities and Validation
- **Zod**: TypeScript-first schema validation library
- **Date-fns**: Date utility library for time-related operations
- **Nanoid**: Unique ID generation utility
- **React Hook Form**: Form handling with validation integration

The application is designed to work seamlessly in the Replit environment while maintaining compatibility with standard deployment platforms.