# Accident Instructions Section

## Overview

The Accident Instructions section provides step-by-step guidance for passengers and drivers on what to do in case of a vehicle accident. This critical safety feature displays prioritized instructions with visual indicators to help users respond effectively during emergencies.

## Features

- **Step-by-step instructions**: Numbered steps in logical order
- **Priority levels**: Visual indicators (critical, high, medium, low) with color coding
- **Emergency contact**: Prominent display of emergency phone numbers
- **Icon support**: Material UI icons for visual clarity
- **Rich text details**: Additional information for each step
- **Responsive design**: Adapts to mobile and desktop screens
- **Customizable styling**: Background color and container width options

## CMS Components

### Main Component
**File**: `cms/src/components/page/accident-instructions.json`

```json
{
  "title": "string (required, localized)",
  "subtitle": "text (optional, localized)",
  "emergencyNumber": "string (required)",
  "instructions": "component[] (required)",
  "backgroundColor": "string (default: #fff3e0)",
  "containerMaxWidth": "enum (xs|sm|md|lg|xl, default: lg)"
}
```

### Instruction Item Component
**File**: `cms/src/components/page/accident-instruction-item.json`

```json
{
  "step": "integer (required)",
  "icon": "string (required, default: CheckCircle)",
  "title": "string (required, localized)",
  "description": "text (required, localized)",
  "priority": "enum (critical|high|medium|low, default: medium)",
  "details": "richtext (optional, localized)"
}
```

## Frontend Implementation

### Component
**File**: `front/src/components/section/AccidentInstructions.tsx`

**Props**:
```typescript
interface AccidentInstructionsProps {
  section: AccidentInstructions;
}
```

**Features**:
- Automatic sorting by step number
- Color-coded priority badges
- Emergency alert banner
- Bordered cards with priority color indicators
- Expandable details section
- Icon mapping for Material UI icons

### Skeleton
**File**: `front/src/components/section/skeleton/AccidentInstructionsSkeleton.tsx`

Displays loading state with 6 placeholder cards.

## Priority Levels

| Priority | Color | Use Case |
|----------|-------|----------|
| `critical` | Red (error) | Life-threatening situations, immediate actions |
| `high` | Orange (warning) | Important but not immediately life-threatening |
| `medium` | Blue (info) | Standard procedures |
| `low` | Gray (default) | Optional or follow-up actions |

## Recommended Icons

- `LocalHospital` - Medical/first aid
- `Phone` - Emergency calls
- `Healing` - Injury assessment
- `Description` - Documentation
- `People` - Information exchange
- `Assignment` - Forms/reports
- `ContactPhone` - Contact insurance
- `MedicalServices` - Medical consultation
- `Warning` - Warnings
- `Security` - Safety measures

## Usage in Strapi

1. Navigate to Content Manager → Dynamic Pages
2. Create or edit a page
3. Add "Accident Instructions" section
4. Fill in:
   - Title (e.g., "Instructions en Cas d'Accident")
   - Subtitle (optional context)
   - Emergency Number (e.g., "117 / 118")
   - Background Color (optional, default: #fff3e0)
   - Container Max Width (optional, default: lg)
5. Add instruction items:
   - Set step number (1, 2, 3...)
   - Choose appropriate icon
   - Write clear title and description
   - Set priority level
   - Add optional rich text details
6. Save and publish

## Sample Content

See `cms/content/accident-instructions.mutation.json` for a complete example with 8 steps covering:
1. Securing the accident zone
2. Calling emergency services
3. Checking for injuries
4. Documenting the scene
5. Exchanging information
6. Filling out accident reports
7. Contacting insurance
8. Medical consultation

## Styling

### Default Colors
- Background: `#fff3e0` (light orange/warning)
- Critical border: Red (`error.main`)
- High border: Orange (`warning.main`)
- Medium border: Blue (`info.main`)
- Low border: Gray (`default`)

### Layout
- 2-column grid on desktop (md+)
- Single column on mobile
- Cards with left border indicating priority
- Numbered circles for step indicators
- Chip badges for priority labels

## Internationalization

All text fields support i18n:
- `title` - Section title
- `subtitle` - Section subtitle
- `instructions[].title` - Instruction title
- `instructions[].description` - Instruction description
- `instructions[].details` - Additional details (rich text)

Emergency number is not localized (same across all languages).

## Best Practices

1. **Keep steps concise**: 6-10 steps maximum
2. **Use clear language**: Avoid technical jargon
3. **Prioritize correctly**: Reserve "critical" for life-safety actions
4. **Order logically**: Follow the natural sequence of events
5. **Include details**: Use the details field for additional context
6. **Choose appropriate icons**: Match icons to the action described
7. **Test on mobile**: Ensure readability on small screens
8. **Update regularly**: Review content with safety experts

## Integration

The section is automatically registered in:
- `front/src/constants/section.types.ts` as `ACCIDENT_INSTRUCTIONS`
- `front/src/components/section/Section.tsx` component mapping
- `front/src/api/dynamic-page.api.ts` TypeScript types
- `cms/src/api/dynamic-page/content-types/dynamic-page/schema.json` dynamic zone

## Related Sections

- **Safety Measures**: General safety information
- **Emergency Contacts**: Contact information for emergencies
- **Insurance Coverage**: Insurance details and claims
- **Safety Tips**: Preventive safety advice

## Accessibility

- Semantic HTML structure
- Color is not the only indicator (text labels included)
- Keyboard navigation support
- Screen reader friendly
- High contrast text
- Clear visual hierarchy

## Testing Checklist

- [ ] Section displays correctly on desktop
- [ ] Section displays correctly on mobile
- [ ] Steps are sorted by step number
- [ ] Priority colors display correctly
- [ ] Emergency number is prominent
- [ ] Icons render properly
- [ ] Details expand/display correctly
- [ ] Skeleton loads during data fetch
- [ ] Internationalization works
- [ ] Accessible with keyboard
- [ ] Screen reader compatible
