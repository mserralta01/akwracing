# UI Guidelines for AKW Racing Academy

## Design System

The application uses a racing-themed design system with:

- **Primary Colors**:
  - Racing Red: Used for primary calls-to-action and emphasis
  - Navy Blue: Used for backgrounds and headers
  - White/Off-white: Used for text and light backgrounds
  
- **Typography**:
  - Headings: Bold, with larger sizes for emphasis
  - Body text: Regular weight for readability
  - All text uses the default Tailwind sans-serif font stack
  
- **Spacing**:
  - Consistent spacing using Tailwind's spacing scale
  - Proper padding around content for readability
  - Responsive margins for different device sizes

## Component Library

- The application uses [Shadcn UI](https://ui.shadcn.com/) components
- All components are located in `components/ui/`
- Custom components should maintain the same style and pattern

## Layout Patterns

- Use responsive grid layouts with Tailwind CSS
- Mobile-first approach for all designs
- Standard page layout:
  - Navigation at the top
  - Content in the middle
  - Footer at the bottom
  
## Animation Guidelines

- Use Framer Motion for animations
- Keep animations subtle and purposeful
- Common animation patterns:
  - Fade in when elements enter viewport
  - Subtle hover effects on interactive elements
  - Smooth transitions between states

## Racing-Themed Elements

- Racing stripe accents in backgrounds
- Checkered flag patterns for section separators
- Trophy, helmet, and car icons for racing-related content
- Dynamics and speed suggested through diagonal lines and angles

## Responsive Design

- Mobile breakpoint: < 640px
- Tablet breakpoint: 640px - 1024px
- Desktop breakpoint: > 1024px
- Use Tailwind responsive prefixes (sm:, md:, lg:, xl:)

## Accessibility

- Maintain proper color contrast for readability
- Use semantic HTML elements
- Ensure keyboard navigation works properly
- Add appropriate ARIA attributes when needed

## Icons

- Use Lucide React icons for consistent style
- Keep icon sizes proportional to text
- Use the same color scheme as text for icons

## Forms

- Use React Hook Form for form management
- Implement proper validation with error messages
- Maintain consistent styling for form elements
- Use loading states during form submission 